require('dotenv').config()

const Telegraf = require('telegraf')
const {promisify} = require('util')
const axios = require('axios')
const _ = require('lodash')

const bot = new Telegraf(process.env.BOT_TOKEN)
const Markup = require('telegraf/markup')

let state = {}

const KB = {
  main: {
    destination: 'Я уже или хочу В',
    chat: 'Чат',
    visa: 'Визы и Эмграция',
    attractions: 'Главнейшие достопримечательности',
    slang: 'Словарь сленга',
    laws: 'Местные Законы',
    initiative: 'Хочу внести лепту',
    transport: 'Попутчики и знакомства',
    back: 'Назад'
  },
  place: {
    queensland: {
      name: 'Queensland',
      coordinates: '54.6994947260683,20.5036172478323',
    },
    southAustralia: {
      name: 'South Australia',
      coordinates: '57.6994947260683,27.5036172478323',
    },
    tasmania: {
      name: 'Tasmania',
      coordinates: '56.6994947260683,28.5036172478323',
    },
    newSouthWealth: {
      name: 'New South Wealth',
      coordinates: '78.6994947260683,35.5036172478323',
    },
    westernAustralia: {
      name: 'Western Australia',
      coordinates: '58.6994947260683,27.5036172478323',
    },
    northernTerritory: {
      name: 'Northern Territory',
      coordinates: '74.6994947260683,79.5036172478323',
    }
  },
  transport: {
    auto: 'Прокат Авто',
    bike: 'Скутер/велик',
    public: 'Общественный транспорт',
  },
  initiative: {
    feedback: 'Оставить отзыв',
    button: 'Добавить свою кнопку'
  }
  
}

bot.start(ctx => {
  sendGreeting(ctx);
})

bot.on('message', ctx => {

  switch(ctx.message.text) {
    case KB.main.destination:
      sendDestination(ctx)
      break
    case KB.main.chat:
      sendChat(ctx)
      break
    case KB.main.visa:
      sendVisa(ctx)
      break
    case KB.main.attractions:
      sendAttractions(ctx)
      break
    case KB.main.slang:
      sendSlang(ctx)
      break
    case KB.main.laws:
      sendLaws(ctx)
      break
    case KB.main.initiative:
      sendInitiative(ctx)
      break
    case KB.initiative.feedback:
      sendInitiative(ctx, 'feedback')
      break
    case KB.initiative.button:
      sendInitiative(ctx, 'button')
      break
    case KB.main.transport:
      sendTransport(ctx)
      break
    case KB.transport.auto:
      sendTransport(ctx, 'auto')
      break
    case KB.transport.bike:
      sendTransport(ctx, 'bike')
      break
    case KB.transport.public:
      sendTransport(ctx, 'public')
      break
    /* --------------------------- */
    case KB.place.queensland.name:
      sendMap(ctx, KB.place.queensland.coordinates)
      break
    case KB.place.southAustralia.name:
      sendMap(ctx, KB.place.southAustralia.coordinates)
      break
    case KB.place.tasmania.name:
      sendMap(ctx, KB.place.tasmania.coordinates)
      break
    case KB.place.newSouthWealth.name:
      sendMap(ctx, KB.place.newSouthWealth.coordinates)
      break
    case KB.place.westernAustralia.name:
      sendMap(ctx, KB.place.westernAustralia.coordinates)
      break
    case KB.place.northernTerritory.name:
      sendMap(ctx, KB.place.northernTerritory.coordinates)
      break
    case KB.main.back:
      sendGreeting(ctx, false)
      break
  }

})

function sendGreeting(ctx, sayHello = true) {

  const text = sayHello
    ? `Приветствую ${ctx.from.first_name}\nЧто Вы хотите сделать?`
    : `Что Вы хотите сделать?`;

    return ctx.reply(text,
        Markup.keyboard([
         [KB.main.destination, KB.main.chat],
         [KB.main.visa, KB.main.attractions],
         [KB.main.initiative, KB.main.transport],
         [KB.main.laws, KB.main.slang],
        ]).extra()
      )
}

/* Function Bloc */

function sendDestination(ctx) {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ctx.reply(text)
}

function sendChat(ctx) {
  const text = 'Здесь будет находится Чат... Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  ctx.reply(text)
}

function sendVisa(ctx) {
  const text = 'Здесь будет находится Информация о получении визы... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ctx.reply(text)
}

function sendLaws(ctx) {
  const text = 'Здесь будет находится Местные Законы... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  ctx.reply(text)
}

function sendAttractions(ctx) {

    const text = 'Выберите место'

    return ctx.reply(text,
        Markup.keyboard([
         [KB.place.queensland.name, KB.place.southAustralia.name],
         [KB.place.tasmania.name, KB.place.newSouthWealth.name],
         [KB.place.westernAustralia.name, KB.place.northernTerritory.name],
         [KB.main.back]
        ]).extra()
      )
}

function sendSlang(ctx) {
  const text = 'Здесь будет находится - Cловарь сленга... Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  ctx.reply(text)
}
function sendInitiative(ctx, type = false) {

  if (!type) {
    const text = 'Отзывы и предложения'

    ctx.reply(text, 
      Markup.keyboard([
        [KB.initiative.feedback, KB.initiative.button],
        [KB.main.back]
      ]).extra()
    )

  } else {
    if (type == 'feedback') {

      const text = 'Вы выбрали Написать отзыв' 

      ctx.reply(text,
        Markup.keyboard([
          [KB.main.initiative]
        ]).extra()
      )

    }
    if (type == 'button') {

      const text = 'Вы выбрали Добавить кнопку' 

      ctx.reply(text,
        Markup.keyboard([
          [KB.main.initiative]
        ]).extra()
      )

    }
  }

}

function sendTransport(ctx, type = false) {

  if (!type) {

    const text = 'Выберите транспорт'

    ctx.reply(text, 
      Markup.keyboard([
        [KB.transport.auto, KB.transport.bike, KB.transport.public],
        [KB.main.back]
      ]).extra()
    )

  } else {
    if (type == 'auto') {

      const text = 'Вы выбрали Автомобиль' 

      ctx.reply(text,
        Markup.keyboard([
          [KB.main.transport]
        ]).extra()
      )

    }
    if (type == 'bike') { 

      const text = 'Вы выбрали Байк'

      ctx.reply(text,
        Markup.keyboard([
          [KB.main.transport]
        ]).extra()
      )

    }

    if (type == 'public') {

      const text = 'Вы выбрали Общественный транспорт'

      ctx.reply(text,
        Markup.keyboard([
          [KB.main.transport]
        ]).extra()
      )

    }
    
  }

}

function sendMap(ctx, coordinates) {

  const link = `https://www.google.com/maps?q=${coordinates}`
  
  return ctx.reply(link)
  /* type 2 */
  //ctx.replyWithLocation(54.699484, 20.503634)
}

bot.startPolling()
