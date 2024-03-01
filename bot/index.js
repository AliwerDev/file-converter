const _ = require("lodash");
const TelegramBot = require("node-telegram-bot-api");

const User = require("../models/user");

const { mainKeys, keys } = require("./keys");

class ConverterBot {
  constructor(TG_TOKEN) {
    this.bot = new TelegramBot(TG_TOKEN, { polling: true });
    this.bot.on("message", this.onMessage);
    this.bot.on("callback_query", this.onCallBackQuery);
  }

  // MESSAGE HANDLER
  onMessage = async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;

    // USER CHECKING
    const user = await User.findOne({ chatId }).cache(300, chatId);
    if (!user) return this.createUser(chatId, msg);

    // CHECK BOT STEPS
    // if (user.botStep === botSteps.groupName) return this.enterGroupName(user, message);

    // new functions
    // if (_.startsWith(message, keys.message)) return this.sendMessageToGroup(user, message);

    // CHECKING MESSAGE
    switch (message) {
      case keys.start:
        this.clickBotStart(user);
        break;
      default:
        this.bot.deleteMessage(chatId, msg.message_id);
    }
  };

  // CALLBACK HANDLER
  onCallBackQuery = async (query) => {
    const chatId = query.from.id;
    const user = await User.findOne({ chatId }).cache(300, chatId);

    // if (query.data.startsWith("CURRENT_GROUP")) return this.changeCurrentGroup(user, query);
  };

  // MENU CLICK FUNCTIONS
  clickBotStart(user) {
    if (user.botStep) {
      user.botStep = "";
      user.save();
    }
    this.sendMessage(user, "🎉 Botga xush kelibsiz!");
  }

  // BOT FUNCTIONS
  createUser(chatId, msg) {
    const userdata = { firstName: msg.from.first_name, lastName: msg.from.last_name, userName: msg.from.username, chatId };
    const user = new User(userdata);
    user
      .save()
      .then((user) => this.clickBotStart(user))
      .catch((err) => {
        console.log("Qayta creating");
      });
  }

  messageOptions(keys, isInline = false, withoutKey = false) {
    const opts = {
      parse_mode: "HTML",
      reply_markup: {
        resize_keyboard: true,
        // one_time_keyboard: true,
      },
    };

    if (withoutKey) return opts;

    if (!isInline) opts.reply_markup.keyboard = keys;
    else opts.reply_markup.inline_keyboard = keys;

    return opts;
  }

  sendMessage(user, message, { keys = mainKeys, isInline = false, chatId, withoutKey = false, editMsgId = null } = {}) {
    // chatId = chatId || user.chatId;
    // let options = this.messageOptions(keys, isInline, withoutKey);
    // if (!user.currentGroupId && !_.isEqual(keys, onlyHomePageKey)) options = this.messageOptions(noCurrentGroupKeys);
    // if (editMsgId) this.bot.editMessageText(message, { chat_id: chatId, message_id: editMsgId, ...options });
    // else this.bot.sendMessage(chatId, message, options);
  }
}

module.exports = ConverterBot;
