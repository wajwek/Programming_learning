import { linksApi } from "./api.js";
import { onLoginSuccess, onLogoutSuccess } from "./auth.js";

function sanitizeUrl(urlString) {
  const trimmed = urlString.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

export function initLinks() {
  const linkForm = document.querySelector("#link-form");
  const nameInput = document.querySelector("#link-name");
  const urlInput = document.querySelector("#link-url");
  const errorMessage = document.querySelector("#link-form-error");
  const statusMessage = document.querySelector("#link-form-status");
  const linksList = document.querySelector("#custom-links-list");
  const linksSection = document.querySelector("#linki");
  const addLinkButton = document.querySelector("#add-link-btn");

  if (!linkForm || !nameInput || !urlInput || !errorMessage
    || !statusMessage || !linksList || !linksSection || !addLinkButton) {
    throw new Error("Nie znaleziono wszystkich elementów formularza odnośników.");
  }

  linkForm.noValidate = true;
  let savedLinks = [];
  linksSection.classList.add("hidden");

  onLoginSuccess(async () => {
    linksSection.classList.remove("hidden");
    try {
      savedLinks = await linksApi.getAll();
      renderLinks(savedLinks);
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });

  onLogoutSuccess(() => {
    savedLinks = [];
    linksList.replaceChildren();
    resetLinkFields();
    clearMessages();
    clearInvalidState();
    linksSection.classList.add("hidden");
  });

  addLinkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    clearMessages();
    clearInvalidState();

    const title = nameInput.value.trim();
    const safeUrl = sanitizeUrl(urlInput.value);
    const validationErrors = [];

    if (title.length < 3 || title.length > 100) {
      validationErrors.push("Nazwa musi mieć od 3 do 100 znaków.");
      nameInput.setAttribute("aria-invalid", "true");
    }

    if (!safeUrl) {
      validationErrors.push("Podaj poprawny adres URL zaczynający się od http:// lub https://.");
      urlInput.setAttribute("aria-invalid", "true");
    }

    if (validationErrors.length > 0) {
      errorMessage.textContent = validationErrors.join(" ");
      return;
    }

    try {
      const createdLink = await linksApi.create({ title, url: safeUrl });
      savedLinks = [...savedLinks, createdLink];
      renderLinks(savedLinks);
      resetLinkFields();
      statusMessage.textContent = "Odnośnik został poprawnie dodany.";
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });

  linksList.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.target;
    const deleteButton = target instanceof Element
      ? target.closest("[data-delete-link]")
      : null;
    const linkToDelete = deleteButton?.closest("[data-link-id]");
    const linkId = linkToDelete?.dataset.linkId;

    if (!linkId) return;

    deleteButton.disabled = true;
    clearMessages();
    try {
      await linksApi.delete(linkId);
      savedLinks = savedLinks.filter((link) => String(link.id) !== linkId);
      renderLinks(savedLinks);
      statusMessage.textContent = "Odnośnik został usunięty.";
    } catch (error) {
      deleteButton.disabled = false;
      errorMessage.textContent = error.message;
    }
  });

  function renderLinks(links) {
    linksList.replaceChildren();

    links.forEach((link) => {
      const listItem = document.createElement("li");
      listItem.dataset.linkId = String(link.id);

      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.target = "_blank";
      linkElement.rel = "noopener noreferrer";
      linkElement.textContent = link.title;

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.dataset.deleteLink = "";
      deleteButton.textContent = "Usuń";
      deleteButton.setAttribute("aria-label", `Usuń odnośnik ${link.title}`);

      listItem.append(linkElement, deleteButton);
      linksList.append(listItem);
    });
  }

  function clearMessages() {
    errorMessage.textContent = "";
    statusMessage.textContent = "";
  }

  function clearInvalidState() {
    nameInput.removeAttribute("aria-invalid");
    urlInput.removeAttribute("aria-invalid");
  }

  function resetLinkFields() {
    nameInput.value = "";
    urlInput.value = "";
  }
}
