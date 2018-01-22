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
    case KB.picture:
      sendPictureScreen(ctx)
      break
    case KB.currency:
      sendCurrencyScreen(ctx)
      break
    case KB.back:
      sendGreeting(ctx, false)
      break
    case KB.map:
      sendMap(ctx)
      break  
    case KB.car:
    case KB.cat:
      sendPictureByName(ctx)
      break
  }

})

// bot.command('help', ctx => ctx.reply('Try send a sticker!'))
// bot.hears('hi', ctx => ctx.reply('Hey there!'))
// bot.hears(/buy/i, ctx => ctx.reply('Buy-buy!'))
// bot.on('sticker', ctx => ctx.reply('👍'))


// bot.command('top', ctx => {
//     const userId = ctx.message.from.id

//     if (!state[userId]) {
//         state[userId] = {id: userId}
//     }

//     state[userId].command = 'top'

//     return ctx.replyWithMarkdown(`Enter a subreddit name to get *top* posts.`)
// })

// bot.command('hot', ctx => {
//     const userId = ctx.message.from.id

//     if (!state[userId]) {
//         state[userId] = {id: userId}
//     }

//     state[userId].command = 'hot'

//     return ctx.replyWithMarkdown('Enter a subreddit name to get *hot* posts.')
// })

// bot.on('text', ctx => {

//     const subreddit = ctx.message.text
//     const userId = ctx.message.from.id
//     const type = !state[userId] ? 'top' : state[userId].command ? state[userId].command : 'top';

//     if (!state[userId]){
//         state[userId] = {};
//     }

//     state[userId].index = 0;

//     axios
//         .get(`https://reddit.com/r/${subreddit}/${type}.json?limit=10`)
//         .then(res => {
//             const data = res.data.data

//             if (data.children.length < 1) {
//                 return ctx.reply('The subreddit not found.')
//             }

//             const link = `https://reddit.com/${data.children[0].data.permalink}`

//             return ctx.reply(link,
//                     Markup.inlineKeyboard([
//                         Markup.callbackButton('➡️ Next', subreddit),
//                     ]).extra()
//                 )


//         })
//         .catch(err => console.log(err))

// })

// bot.on('callback_query', ctx => {
//   const subreddit = ctx.update.callback_query.data;
//   const userId = ctx.update.callback_query.from.id;

//   let type;
//   let index;

//   try {

//     type = state[userId].command ? state[userId].command : 'top'
//     index = state[userId].index;

//   } catch (err) {

//     return ctx.reply('Send a subreddit name.')

//   }

//   ctx.answerCbQuery('Wait...')

//   axios.get(`https://reddit.com/r/${subreddit}/${type}.json?limit=10`)
//     .then(res => {

//       const data = res.data.data;

//       if (!data.children[index + 1])
//         return ctx.reply('No more posts!')

//       const link = `https://reddit.com/${data.children[index + 1].data.permalink}`

//       state[userId].index = state[userId].index + 1

//       return ctx.reply(link,
//         Markup.inlineKeyboard([
//           Markup.callbackButton('➡️ Next', subreddit),
//         ]).extra()
//       )

//     })
//     .catch(err => console.log(err))
// })

bot.on('callback_query', ctx => {

  const base = ctx.update.callback_query.data
  const symbol = 'RUB';

  ctx.answerCbQuery('Wait...')

  axios.get(`https://api.fixer.io/latest?symbols=${symbol}&base=${base}`)
    .then(res => {

      const html = `<b>1 ${base}</b> - <em>${res.data.rates[symbol]} ${symbol}</em>`

      ctx.replyWithHTML(html)

    })
    .catch(err => console.log(err))
})

function sendGreeting(ctx, sayHello = true) {

  const text = sayHello
    ? `Приветствую ${ctx.from.first_name}\nЧто Вы хотите сделать?`
    : `Что Вы хотите сделать?`;

    return ctx.reply(text,
        Markup.keyboard([
         [KB.currency, KB.picture],
         [KB.map]
        ]).extra()
      )
}

function sendPictureScreen(ctx) {

  const text = 'Выберите тип картинки: '

  return ctx.reply(text,
        Markup.keyboard([
          [KB.car, KB.cat],
          [KB.back]
        ]).extra()
      )
}

function sendPictureByName(ctx) {

  const srcs = picSrc[ctx.message.text]
  const src = srcs[_.random(0, srcs.length - 1)]

  ctx.reply('Загружаю...')

  ctx.replyWithPhoto({
    source: `${__dirname}/pictures/${src}`
  })

}

function sendCurrencyScreen(ctx) {

  const text = 'Выберите тип валюты:'

  return ctx.reply(text,
        Markup.inlineKeyboard([
          Markup.callbackButton('Доллар', 'USD'),
          Markup.callbackButton('Евро', 'EUR'),
        ]).extra()
      )
}

function sendMap(ctx) {

  const link = 'https://www.google.com/maps?q=54.6994947260683,20.5036172478323'
  
  return ctx.reply(link).extra()
  /* type 2 */
  //ctx.replyWithLocation(54.699484, 20.503634)
}

bot.startPolling()
