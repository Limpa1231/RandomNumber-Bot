const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5807895761:AAGXqZaUNImLJWMNPlH9q2NrXuKPKwaGELo'

const bot =new TelegramApi(token, {polling:true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Отгадай число, которое я загадал, подсказка, от 0 до 9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Угадай число'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start'){
           await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/11.webp')
           return bot.sendMessage(chatId, 'Добро пожаловать в наш первый эксперимент!')
        }
        if(text === '/info'){
           return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game'){
           return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Попробуйте другую команду')
    })

    bot.on('callback_query', async msg  => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
           return startGame(chatId)
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Вы угадали, это цифра ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `К сожалению, вы не угадали, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()