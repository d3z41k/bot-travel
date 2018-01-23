require('dotenv').config()

const Telegraf = require('telegraf')
const {promisify} = require('util')
const axios = require('axios')
const _ = require('lodash')

const bot = new Telegraf(process.env.BOT_TOKEN)
const { Markup } = require('telegraf')

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
    queensland: 'Queensland',
    southAustralia: 'South Australia',
    tasmania: 'Tasmania',
    newSouthWealth: 'New South Wealth',
    westernAustralia: 'Western Australia',
    northernTerritory: 'Northern Territory'
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
    case KB.main.attractions:
      sendAttractionsScreen(ctx)
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

function sendAttractionsScreen(ctx) {

    const text = 'Выберите место'

    return ctx.reply(text,
        Markup.keyboard([
         [KB.place.queensland, KB.place.southAustralia],
         [KB.place.tasmania, KB.place.newSouthWealth],
         [KB.place.westernAustralia, KB.place.northernTerritory],
         [KB.main.back]
        ]).extra()
      )
}

function sendMap(ctx) {

  const link = 'https://www.google.com/maps?q=54.6994947260683,20.5036172478323'
  
  return ctx.reply(link).extra()
  /* type 2 */
  //ctx.replyWithLocation(54.699484, 20.503634)
}

// function sendPictureScreen(ctx) {

//   const text = 'Выберите тип картинки: '

//   return ctx.reply(text,
//         Markup.keyboard([
//           [KB.car, KB.cat],
//           [KB.back]
//         ]).extra()
//       )
// }

// function sendPictureByName(ctx) {

//   const srcs = picSrc[ctx.message.text]
//   const src = srcs[_.random(0, srcs.length - 1)]

//   ctx.reply('Загружаю...')

//   ctx.replyWithPhoto({
//     source: `${__dirname}/pictures/${src}`
//   })

// }

// function sendCurrencyScreen(ctx) {

//   const text = 'Выберите тип валюты:'

//   return ctx.reply(text,
//         Markup.inlineKeyboard([
//           Markup.callbackButton('Доллар', 'USD'),
//           Markup.callbackButton('Евро', 'EUR'),
//         ]).extra()
//       )
// }

// bot.on('callback_query', ctx => {

//   const base = ctx.update.callback_query.data
//   const symbol = 'RUB';

//   ctx.answerCbQuery('Wait...')

//   axios.get(`https://api.fixer.io/latest?symbols=${symbol}&base=${base}`)
//     .then(res => {

//       const html = `<b>1 ${base}</b> - <em>${res.data.rates[symbol]} ${symbol}</em>`

//       ctx.replyWithHTML(html)

//     })
//     .catch(err => console.log(err))
// })

bot.startPolling()
