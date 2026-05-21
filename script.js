const filterButtons = document.querySelectorAll(".filter-button");
const trendCards = document.querySelectorAll(".trend-card");
const subscribeForm = document.querySelector(".subscribe-form");
const formNote = document.querySelector(".form-note");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    trendCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

subscribeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = new FormData(subscribeForm).get("email");
  formNote.textContent = email
    ? `${email} için demo kayıt alındı. Gerçek entegrasyon sonraki adım.`
    : "Devam etmek için bir e-posta adresi gir.";
});
