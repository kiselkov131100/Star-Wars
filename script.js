/* Что нужно сделать:

Есть сервис такой, https://swapi.dev/ , здесь размещено API по которому можно забрать информацию по персонажам/кораблям вселенной звездных войн. 
Например, по адресу https://swapi.dev/people/ получаем список всех персонажей (там используется пагинация, т.е. запрос разбит на страницы).

Надо сделать страницу, на которой изначально будет 2 пустые карточки (просто контейнер с границами).
Под каждой карточкой кнопка "Play". При нажатии на кнопку отправляется запрос на API для того, чтобы рандомно получить какого-либо из персонажей.
Получив информацию, надо вывести ее в карточке (достаточно вывести name, height и mass).
Если персонаж есть в каждой из карточек, то вывести над карточкой надпись Winner или Looser на базе того, чья масса больше (поле mass). 

Добавить страницу с результатами, где будет показываться кол-во побед игрока 1 и игрока 2 за все время 
(т.е. информация будет доступна и после перезагрузки страницы).
*/

let firstHero, secondHero;

async function fetchHero(event) {
  let randNum = Math.floor(Math.random() * (83 - 1 + 1)) + 1; // Math.floor(Math.random() * (max - min + 1)) + min - рандомное число в заданном диапазоне,
  // включая min и max, где max = 83, min = 1 (потому что на сайте есть персонажи от 1 до 83, кроме 17 почему-то)
  let response = await fetch(`https://swapi.dev/api/people/${randNum}`); // делаем запрос на api
  let json;
  if (response.ok) {
    // если все хорошо, работаем с ответом
    json = await response.json(); // преобразуем json, который пришел к нам с api, в обычный объект
    event.target.parentNode.firstElementChild.innerHTML = `name: ${json.name}<br>height: ${json.height}<br>mass: ${json.mass}`;
    // event.target возвращает кнопку, по которой мы нажали, далее получаем родителя, далее получаем первый дочерний узел, куда кладем параметры из ответа
  } else {
    // если статус ответа сервера не в диапазоне 200-299, то выведет сообщение (например, если randNum = 17, то ответ будет со статусом 404,
    // потому что по какой-то причине на том сайте нет персонажа с id = 17)
    alert("Что-то пошло не так :(");
  }

  if (event.target.id === "left-button") firstHero = json;
  // если нажали по кнопке слева, то объект ответа кладем в переменную firstHero, чтобы потом его можно было юзать
  else if (event.target.id === "right-button") secondHero = json; // а если по правой нажали, то ответ кладем в secondHero

  if (
    firstHero &&
    secondHero &&
    firstHero.mass !== "unknown" &&
    secondHero.mass !== "unknown"
  ) {
    // если мы нажали уже по двум кнопкам и нам известна масса каждого персонажа, то идем дальше
    if (+firstHero.mass > +secondHero.mass) showResult("first", "second");
    // здесь и в строке ниже вызываем функцию, которая отобразит результат сравнения на страницу в зависимости от самого результата
    else if (+firstHero.mass < +secondHero.mass) showResult("second", "first");
    // первый аргумент - победитель, второй - проигравший; эта строка срабатывает, если масса второго героя больше,
    // т.е. в качестве победителя мы передаем аргумент 'second', а в качестве проигравшего - 'first'; строка выше делает то же самое, но наоборот
    else {
      // если массы равны
      document.querySelector("#first-result-field").innerHTML =
        "Friendship won";
      document.querySelector("#second-result-field").innerHTML =
        "Friendship won";
    }
  }
}

function showResult(winner, looser) {
  let nodeOfWinner = document.querySelector(`#${winner}-result-field`);
  nodeOfWinner.innerHTML = "Winner";
  nodeOfWinner.style.color = "green";
  let nodeOfLooser = document.querySelector(`#${looser}-result-field`);
  nodeOfLooser.innerHTML = "Looser";
  nodeOfLooser.style.color = "red";
  let score = localStorage.getItem(`${winner}Gamer`); // получаем счет победившего игрока; если счет еще не записан, то вернется null
  localStorage.setItem(`${winner}Gamer`, ++score); // перезаписываем счет, увеличивая его на 1 (если счет еще не был записан,
  //   то score = null => null преобразуется в 0 => ++0 = 1)
}

let buttons = document.querySelectorAll("button"); // получаем все кнопки на странице
buttons.forEach((button) => {
  button.addEventListener("click", fetchHero); // на каждую кнопку вешаем слушатель события
});
