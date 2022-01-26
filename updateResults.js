document.querySelector("#firstGamer").innerHTML =
  localStorage.getItem("firstGamer"); // этот скрипт срабатывает каждый раз, когда обновляется страница results.html
document.querySelector("#secondGamer").innerHTML =
  localStorage.getItem("secondGamer"); // из локального хранилища получаем результаты обоих игроков и записываем их в соответствующие поля
document.querySelector("button").addEventListener("click", () => {
  // кнопка, нажав на которую можно сбросить локальное хранилище на зоводские настройки
  localStorage.clear();
  window.location.reload();
});
