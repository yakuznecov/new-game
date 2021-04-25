var $start = document.querySelector('#start'); // 1. Забираем объект кнопку
var $game = document.querySelector('#game'); // 5. создаем объект поля игры, будем менять фон на белый
var $time = document.querySelector('#time'); // 35. Обращаемся к элементу таймера
var $result = document.querySelector('#result'); // 51. переменная результата, далее будет функция счета игры
var $timeHeader = document.querySelector('#time-header'); // 47. создаем переменную первого h1 в хедере
var $resultHeader = document.querySelector('#result-header'); // 48. создаем переменную второго h1 в хедере
var $gameTime = document.querySelector('#game-time'); // 62. забираем эту переменную

// 76. создаем массив цветов
var colors = ['#FED2A1', '#64b61a', '#16E3A6', '#9F2EF4', 'ffd06b', '#A015A0', '#FC4D82', '#827FE2', '#59C4CD', '#4871B5', '#EA5C54', '#AE8BF0', '#F2CF58'];
var score = 0; // 22. Переменная подсчета кликов, изначально равна 0
var isGameStarted = false; // 41. Переменная изначально равна false, по умолчанию игра не идет

$start.addEventListener('click', startGame); // 2. Создаем событие и название функции, которая будет передаваться, когда начнется игра
$game.addEventListener('click', handleBoxClick); // 17. Вешаем событие на блок game и создаем функцию клика на случайный блок
$gameTime.addEventListener('input', setGameTime); // 63. прослушка события инпут и вызов функции установки времени

// 66. Создаем функцию показа (рефакторинг кода и его сокращение идет)
function show($el) {
	$el.classList.remove('hide'); // 69. Показывает элемент
}

// 67. Функция скрытия
function hide($el) {
	$el.classList.add('hide'); // 68. прячет элемент
}

// 3. Создаем функцию startGame
function startGame() {
	score = 0; // 55. при старте игры результат необходимо обнулить
	setGameTime(); // 61. при старте игры будем вызывать функцию
	$gameTime.setAttribute('disabled', 'true'); // 65. Мы блокируем инпут во время игры

	isGameStarted = true; // 42. Игра сейчас идет
	$game.style.backgroundColor = '#fff'; // 6. Добавляем белый фон игровому полю
	hide($start); // 72. рефакторинг, замена на функцию, будем прятать кнопку, было -   // $start.classList.add('hide'); // 4. Обращаемся к его класс листу и добавляем класс скрытия кнопки

	// 34. Создаем интервал для счетчика
	var interval = setInterval(function () {
		var time = parseFloat($time.textContent); // 36. Получаем число таймера из html спана, распарсим его

		if (time <= 0) {
			clearInterval(interval); // 40. функция очистки интервала, чтобы не занимал память
			endGame(); // 38. Вызываем функцию, пока еще не созданную
		} else {
			$time.textContent = (time - 0.1).toFixed(1); // 37. Данный метод ограничивает до 1 число цифр после запятой, в скобках была группировка
		}
	}, 100); // обновление каждые 100 милисекунд

	renderBox(); // 8. При старте игре вызываем функцию без параметров
}

// 52. Создаем функцию результата игры, которая будет обращаться к спану result
function setGameScore() {
	$result.textContent = score.toString(); // 53. Обращаемся к score для вывода результата, но функцию необходимо ниже вызвать
}

// 58. Создаем функцию установки значения времени
function setGameTime() {
	var time = +$gameTime.value; // 64. + приводит к числу
	$time.textContent = time.toFixed(1); // 60. фиксация с одним знаком
	show($timeHeader); // 70. Мы изменили код на новую функцию, было -  //$timeHeader.classList.remove('hide');  56. мы будем показывать этот h1
	hide($resultHeader); // 71. Меняем код, связанный с функцией, было так -   // $resultHeader.classList.add('hide'); // 57. а блок результата при старте будем скрывать
}

// 39. Создаем функцию окончания игры
function endGame() {
	isGameStarted = false; // 43. Игра не идет
	setGameScore(); // 54. здесь мы вызываем функцию, чтобы результат отображался
	$gameTime.removeAttribute('disabled'); // 66. Мы снова активируем инпут
	show($start); // 73. Показываем поле, было -   // $start.classList.remove('hide'); // 44. При окончании показываем изначальное поле, удаляя класс
	$game.innerHTML = ''; // 46. чтобы квадраты исчезали, пустая строка в поле
	$game.style.backgroundColor = '#ccc'; // 45. мы меняем цвет фона на изначальный при окончании игры, далее нужно избивиться от квадратов
	hide($timeHeader); // 74. измененный код, было - // $timeHeader.classList.add('hide'); // 49. при окончании мы скрываем таймер игры
	show($resultHeader); // 75. Показываем, было - // $resultHeader.classList.remove('hide'); // 50. показываем результаты игры
}

// 18. Создаем функцию клика на случайный блок
function handleBoxClick(event) {
	if (!isGameStarted) {
		// 44. Если игра не запущена, то прекращаем все клики по квадратам
		return;
	}

	if (event.target.dataset.box) {
		// 20. Если присутствует элемент с именем box, означает, что сделали клик по квадрату
		score++; // 23. Если произошел клик по квадрату, то прибавляем единицу. Генерируется новый блок, но не удаляется и они накапливаются
		renderBox(); // 21. Тогда заново будем генерировать квадрат
	}
}

// 7. Создаем функцию, которая рандомно генерирует квадраты внутри игрового поля
function renderBox() {
	$game.innerHTML = ''; // 24. Очистка содержимого поля, чтобы дивы не накапливались
	var box = document.createElement('div'); // 9. Результат этой функции кладем в переменную, создаем див
	var boxSize = getRandom(30, 100); // 27. Переменная хранит значение рандомного числа
	var gameSize = $game.getBoundingClientRect(); // 29. Создаем переменную вычисления размера всего поля game, данная функция возвращает параметры координат, которые нужны
	var maxTop = gameSize.height - boxSize; // 30. Максимальное отклонение от верхнего поля игры от рандомного числа
	var maxLeft = gameSize.width - boxSize; // 31. Вычисление отклонения от края блока по ширине
	var randomColorIndex = getRandom(0, colors.length); // 78. передаем массив в функцию, где второе значение будет длина массива, а функция округляет в меньшую сторону

	box.style.height = box.style.width = boxSize + 'px'; /* '50px'; - было ранее статическое число */ // 10. Параметры высоты и ширины для блоков. 28. меняем на динамическое число, подставляя переменную
	box.style.position = 'absolute'; // 11. абсолютное позиционирование внутри блока game
	box.style.backgroundColor = colors[randomColorIndex]; // 77. Обращаемся к созданной переменной // был этот элемент'#000'; - 12. Временно черный цвет для блока
	box.style.top = getRandom(0, maxTop) + 'px'; /* '50px'; - было значение */ // 14. Положение сверху в блоке     32. Число от 0 до максимального числа от верхнего края
	box.style.left = getRandom(0, maxLeft) + 'px'; /* '70px'; */ // 15. Положение от левого края      33. Генерация числа положения от левого края поля
	box.style.cursor = 'pointer'; // 16. Добавляем курсор для квадрата
	box.setAttribute('data-box', 'true'); // 19. создаем атрибут, главное, чтобы присутствовал. Для проверки, является квадратом элемент или нет

	$game.insertAdjacentElement('afterbegin', box); // 13. Передаем это в игровое поле, используя эту функцию. Будет вставлено после элемента и кладем сам элемент box
}

// 25. Создание функции значения числа в заданном диапазоне для динамического появления квадратов, возврат рандомного числа
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min); // 26. Обращение к глобальному объекту и вычисление числа, метод floor для округления числового значения
}
