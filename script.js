const formulario = document.querySelector("form");
const { nome, email, senha } = formulario.elements;
const nascimento = formulario.elements.namedItem("data-nascimento");
const campos = [nome, nascimento, email, senha];

const feedback = document.createElement("p");
feedback.setAttribute("role", "status");
formulario.append(feedback);

function obterDataLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

nascimento.max = obterDataLocal();
formulario.noValidate = true;

for (const campo of campos) {
  campo.required = true;
  campo.addEventListener("input", () => {
    campo.setCustomValidity("");
    feedback.textContent = "";
  });
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  feedback.textContent = "";

  nome.value = nome.value.trim().replace(/\s+/g, " ");
  email.value = email.value.trim();
  nascimento.max = obterDataLocal();

  for (const campo of campos) {
    campo.setCustomValidity("");
  }

  if (!nome.value) {
    nome.setCustomValidity("Informe seu nome.");
  } else if (
    !/\p{L}/u.test(nome.value) ||
    !/^[\p{L}\p{M} .’'-]+$/u.test(nome.value)
  ) {
    nome.setCustomValidity(
      "Use letras, espaços, pontos, hífens ou apóstrofos no nome.",
    );
  }

  if (nascimento.validity.badInput || !nascimento.value) {
    nascimento.setCustomValidity("Informe uma data de nascimento válida.");
  } else if (nascimento.validity.rangeOverflow) {
    nascimento.setCustomValidity(
      "A data de nascimento não pode estar no futuro.",
    );
  }

  if (!email.value) {
    email.setCustomValidity("Informe seu e-mail.");
  } else if (email.validity.typeMismatch) {
    email.setCustomValidity("Informe um e-mail válido.");
  }

  if (!senha.value.trim()) {
    senha.setCustomValidity("Informe uma senha.");
  } else if (Array.from(senha.value).length < 8) {
    senha.setCustomValidity("A senha deve ter pelo menos 8 caracteres.");
  }

  if (!formulario.reportValidity()) {
    return;
  }

  const inicioDominio = email.value.lastIndexOf("@") + 1;
  email.value =
    email.value.slice(0, inicioDominio) +
    email.value.slice(inicioDominio).toLowerCase();
  feedback.textContent = "Dados validados com sucesso.";
});
