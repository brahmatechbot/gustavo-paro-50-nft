"use strict";

const CONFIG = Object.freeze({
  metadataUrl: "metadata/1.json",
  metadataFallbackUrl: "https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/1.json",
  localImageUrl: "assets/gustavo-paro-50.jpg",
  contract: "0xfdfc612c11426f257e0044de971dad7076635126",
  tokenId: 1,
  rpcEndpoints: [
    "https://ethereum.publicnode.com",
    "https://1rpc.io/eth",
    "https://eth-mainnet.public.blastapi.io"
  ]
});

const $ = (id) => document.getElementById(id);

function isSafeHttpUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function fetchJson(url, options = {}, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

function validateMetadata(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Metadata inválido");
  }

  if (typeof data.name !== "string" || typeof data.description !== "string") {
    throw new Error("Metadata incompleto");
  }

  return data;
}

function renderTraits(attributes) {
  const list = $("traits-list");
  list.replaceChildren();

  const validAttributes = Array.isArray(attributes)
    ? attributes.filter((attribute) =>
        attribute &&
        typeof attribute.trait_type === "string" &&
        ["string", "number"].includes(typeof attribute.value)
      )
    : [];

  $("traits-loading").hidden = true;

  if (validAttributes.length === 0) {
    $("traits-empty").hidden = false;
    return;
  }

  validAttributes.forEach((attribute) => {
    const wrapper = document.createElement("div");
    wrapper.className = "trait";

    const term = document.createElement("dt");
    term.textContent = attribute.trait_type;

    const value = document.createElement("dd");
    value.textContent = String(attribute.value);

    wrapper.append(term, value);
    list.append(wrapper);
  });

  list.hidden = false;
}

function renderMetadata(metadata) {
  $("nft-name").textContent = metadata.name;
  $("nft-description").textContent = metadata.description;
  document.title = `${metadata.name} | Ethereum NFT`;

  if (typeof metadata.image === "string" && isSafeHttpUrl(metadata.image)) {
    $("nft-image").src = metadata.image;
  }

  if (typeof metadata.external_url === "string" && isSafeHttpUrl(metadata.external_url)) {
    $("linkedin-link").href = metadata.external_url;
  }

  renderTraits(metadata.attributes);
  $("metadata-loading").hidden = true;
  $("metadata-loading").setAttribute("aria-busy", "false");
  $("metadata-error").hidden = true;
  $("metadata-content").hidden = false;
}

async function loadMetadata() {
  $("metadata-loading").hidden = false;
  $("metadata-loading").setAttribute("aria-busy", "true");
  $("metadata-error").hidden = true;
  $("metadata-content").hidden = true;
  $("traits-loading").hidden = false;
  $("traits-list").hidden = true;
  $("traits-empty").hidden = true;

  const urls = [CONFIG.metadataUrl, CONFIG.metadataFallbackUrl];
  let lastError;

  for (const url of urls) {
    try {
      const metadata = validateMetadata(await fetchJson(url));
      renderMetadata(metadata);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Falha ao carregar metadata:", lastError);
  $("metadata-loading").hidden = true;
  $("metadata-loading").setAttribute("aria-busy", "false");
  $("traits-loading").hidden = true;
  $("metadata-error").hidden = false;
}

function ownerOfCallData(tokenId) {
  return `0x6352211e${tokenId.toString(16).padStart(64, "0")}`;
}

function parseOwner(result) {
  if (typeof result !== "string" || !/^0x[0-9a-fA-F]{64}$/.test(result)) {
    throw new Error("Resposta ownerOf inválida");
  }

  const address = `0x${result.slice(-40)}`.toLowerCase();
  if (/^0x0{40}$/.test(address)) {
    throw new Error("Owner vazio");
  }

  return address;
}

async function queryOwnerFrom(endpoint) {
  const payload = [
    {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_chainId",
      params: []
    },
    {
      jsonrpc: "2.0",
      id: 2,
      method: "eth_call",
      params: [
        {
          to: CONFIG.contract,
          data: ownerOfCallData(CONFIG.tokenId)
        },
        "latest"
      ]
    }
  ];

  const response = await fetchJson(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!Array.isArray(response)) {
    throw new Error("JSON-RPC batch não suportado");
  }

  const chainResponse = response.find((entry) => entry.id === 1);
  const ownerResponse = response.find((entry) => entry.id === 2);

  if (chainResponse?.result !== "0x1") {
    throw new Error("Endpoint não está na Ethereum mainnet");
  }

  if (ownerResponse?.error) {
    throw new Error(ownerResponse.error.message || "Falha em ownerOf");
  }

  return parseOwner(ownerResponse?.result);
}

function renderOwner(owner) {
  const link = document.createElement("a");
  link.className = "owner-link";
  link.href = `https://etherscan.io/address/${owner}`;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.setAttribute("aria-label", `Owner atual ${owner}. Abrir no Etherscan`);

  const fullAddress = document.createElement("span");
  fullAddress.className = "address-full";
  fullAddress.textContent = owner;

  const shortAddress = document.createElement("span");
  shortAddress.className = "address-short";
  shortAddress.setAttribute("aria-hidden", "true");
  shortAddress.textContent = `${owner.slice(0, 8)}…${owner.slice(-6)}`;

  link.append(fullAddress, shortAddress);
  $("owner-field").replaceChildren(link);
  $("owner-field").setAttribute("aria-busy", "false");
  $("owner-source").textContent = "Owner confirmado em tempo real por JSON-RPC público na Ethereum mainnet.";
  $("retry-owner").hidden = true;
}

async function loadOwner() {
  $("owner-field").replaceChildren();
  const loading = document.createElement("span");
  loading.className = "owner-loading";
  loading.textContent = "Consultando a Ethereum...";
  $("owner-field").append(loading);
  $("owner-field").setAttribute("aria-busy", "true");
  $("owner-source").textContent = "Consulta direta por JSON-RPC público, sem chave de API.";
  $("retry-owner").hidden = true;

  let lastError;
  for (const endpoint of CONFIG.rpcEndpoints) {
    try {
      const owner = await queryOwnerFrom(endpoint);
      renderOwner(owner);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Falha ao consultar owner:", lastError);
  const errorMessage = document.createElement("span");
  errorMessage.className = "owner-error";
  errorMessage.textContent = "Consulta indisponível no momento.";
  $("owner-field").replaceChildren(errorMessage);
  $("owner-field").setAttribute("aria-busy", "false");
  $("owner-source").textContent = "Os endpoints públicos não responderam. Use o Etherscan para conferir o registro.";
  $("retry-owner").hidden = false;
}

$("nft-image").addEventListener("error", (event) => {
  if (!event.currentTarget.src.endsWith(CONFIG.localImageUrl)) {
    event.currentTarget.src = CONFIG.localImageUrl;
  }
});

$("retry-metadata").addEventListener("click", loadMetadata);
$("retry-owner").addEventListener("click", loadOwner);

loadMetadata();
loadOwner();
