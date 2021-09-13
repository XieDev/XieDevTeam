// Scpirt Xie Dev Team
// Jangan Di Jual!
// Recode Sewajarnya Aja
// Nama Yg Punya Scpirtnya Jangan Dihapus!!
const {
   WAConnection,
	MessageType,
	Presence,
	MessageOptions,
	Mimetype,
	WALocationMessage,
	WA_MESSAGE_STUB_TYPES,
	WA_DEFAULT_EPHEMERAL,
	ReconnectMode,
	ProxyAgent,
	ChatModification,
	GroupSettingChange,
	waChatKey,
	mentionedJid,
	processTime,
	Browsers
} = require('@adiwajshing/baileys')
const fs = require('fs')
const axios = require("axios")
const moment = require('moment-timezone')
const { spawn, exec, execSync } = require('child_process')
const fetch = require('node-fetch')
const ig = require('insta-fetcher');
const hx = require("hxz-api")
const ffmpeg = require('fluent-ffmpeg')
const yts = require( 'yt-search')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const lolis = require('lolis.life')
const loli = new lolis()

const { fetchJson } = require('./lib/fetcher')
const { color, bgcolor } = require('./lib/color')
const { yta, ytv, igdl, upload, formatDate } = require('./lib/ytdl')
const { getBuffer, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')

const welkom = JSON.parse(fs.readFileSync('./database/welkom.json'))
const _stikcmd = JSON.parse(fs.readFileSync('./database/scmd.json'))

public = false
prefix = "#"
fx = "▢"
blocked = []

// Sticker Cmd
const sCmd = (id, command) => {
    const obj = { id: id, chats: command }
    _stikcmd.push(obj)
    fs.writeFileSync('./database/scmd.json', JSON.stringify(_stikcmd))
}

const getCommandPosition = (id) => {
    let position = null
    Object.keys(_stikcmd).forEach((i) => {
        if (_stikcmd[i].id === id) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}

const getCmd = (id) => {
    let position = null
    Object.keys(_stikcmd).forEach((i) => {
        if (_stikcmd[i].id === id) {
            position = i
        }
    })
    if (position !== null) {
        return _stikcmd[position].chats
    }
}

const checkSCommand = (id) => {
    let status = false
    Object.keys(_stikcmd).forEach((i) => {
        if (_stikcmd[i].id === id) {
            status = true
        }
    })
    return status
}

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
	const xiedev = new WAConnection()
	xiedev.logger.level = 'warn'
	console.log(banner.string)
	xiedev.on('qr', () => {
		console.log(color('[','aqua'), color('Perintah Xie','aqua'), color(']','aqua'), color('Scan Qr Kak'))
	})
	xiedev.on('credentials-updated', () => {
		fs.writeFileSync('./XieDev.json', JSON.stringify(xiedev.base64EncodedAuthInfo(), null, '\t'))
		info('2', 'Proses Login')
	})
	fs.existsSync('./XieDev.json') && xiedev.loadAuthInfo('./XieDev.json')
	xiedev.on('connecting', () => {
		start('2', 'Proses...')
	})
	xiedev.on('open', () => {
		success('2', 'Done!')
	})
	await xiedev.connect({timeoutMs: 30*1000})

	xiedev.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await xiedev.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await xiedev.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Halo @${num.split('@')[0]}\n\nSelamat datang di group *${mdata.subject}*`
				halo = await fs.readFileSync('./mp3/halo.mp3')
				let buff = await getBuffer(ppimg)
				xiedev.sendMessage(mdata.id, buff, MessageType.image, {quoted: {key : {participant : '0@s.whatsapp.net'}, message: {orderMessage: {itemCount : 1, status: 1, surface : 1, message: `Welcome @${num.split('@')[0]}`, orderTitle: `Welcome @${num.split('@')[0]}`, thumbnail: fs.readFileSync('fxsxdev.jpg'), sellerJid: '0@s.whatsapp.net'} } }, caption: teks, contextInfo: {"mentionedJid": [num]}})
			   xiedev.sendMessage(mdata.id, halo, MessageType.audio, {quoted: {key : {participant : '0@s.whatsapp.net'}, message: {orderMessage: {itemCount : 1, status: 1, surface : 1, message: `Welcome @${num.split('@')[0]}`, orderTitle: `Welcome @${num.split('@')[0]}`, thumbnail: fs.readFileSync('fxsxdev.jpg'), sellerJid: '0@s.whatsapp.net'} } }, contextInfo: {"mentionedJid": [num]}, mimetype: 'audio/mp4', ptt:true, seconds: 1000000000})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await xiedev.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Sayonara @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				xiedev.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	
	xiedev.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	xiedev.on('message-new', async (xie) => {
		   try {
			if (!xie.message) return
			if (xie.key && xie.key.remoteJid == 'status@broadcast') return
			if (xie.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(xie.message)
			const from = xie.key.remoteJid
			const type = Object.keys(xie.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
            const cmd = (type === 'conversation' && xie.message.conversation) ? xie.message.conversation : (type == 'imageMessage') && xie.message.imageMessage.caption ? xie.message.imageMessage.caption : (type == 'videoMessage') && xie.message.videoMessage.caption ? xie.message.videoMessage.caption : (type == 'extendedTextMessage') && xie.message.extendedTextMessage.text ? xie.message.extendedTextMessage.text : (type == 'stickerMessage') && (getCmd(xie.message.stickerMessage.fileSha256.toString('hex')) !== null && getCmd(xie.message.stickerMessage.fileSha256.toString('hex')) !== undefined) ? getCmd(xie.message.stickerMessage.fileSha256.toString('hex')) : "".slice(1).trim().split(/ +/).shift().toLowerCase()
			body = (type === 'conversation' && xie.message.conversation.startsWith(prefix)) ? xie.message.conversation : (type == 'imageMessage') && xie.message.imageMessage.caption.startsWith(prefix) ? xie.message.imageMessage.caption : (type == 'videoMessage') && xie.message.videoMessage.caption.startsWith(prefix) ? xie.message.videoMessage.caption : (type == 'extendedTextMessage') && xie.message.extendedTextMessage.text.startsWith(prefix) ? xie.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? xie.message.conversation : (type === 'extendedTextMessage') ? xie.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const argss = budy.slice(command.length + 2, budy.length)
			const q = args.join(' ')
			const isCmd = body.startsWith(prefix)

			const botNumber = xiedev.user.jid
			const ownerNumber = ["6283899137143@s.whatsapp.net"]
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? xie.participant : xie.key.remoteJid
			const groupMetadata = isGroup ? await xiedev.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const itsMeXie = sender == botNumber ? true : false
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const conts = xie.key.fromMe ? xiedev.user.jid : xiedev.contacts[sender] || { notify: jid.replace(/@.+/, '') }
            const pushname = xie.key.fromMe ? xiedev.user.name : conts.notify || conts.vname || conts.name || '-'
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				xiedev.sendMessage(from, teks, text, {quoted:xie})
			}
			const sendMess = (hehe, teks) => {
				xiedev.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? xiedev.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : xiedev.sendMessage(from, teks.trim(), extendedText, {quoted: xie, contextInfo: {"mentionedJid": memberr}})
			}
			const fakethumb = (teks, yes) => {
            xiedev.sendMessage(from, teks, image, {thumbnail: fs.readFileSync('xiedev.jpg'), quoted: xie, caption: yes})
         }
			
			const sendMediaURL = async(url, text="", mids=[]) =>{
         if(mids.length > 0){
          text = normalizeMention(to, text, mids)
         }
         const fn = Date.now() / 10000;
         const filename = fn.toString()
         let mime = ""
         var download = function (uri, filename, callback) {
           request.head(uri, function (err, res, body) {
             mime = res.headers['content-type']
             request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
          });
         };
         download(url, filename, async function () {
           console.log('done');
           let media = fs.readFileSync(filename)
           let type = mime.split("/")[0]+"Message"
           if(mime === "image/gif"){
            type = MessageType.video
            mime = Mimetype.gif
          }
          if(mime.split("/")[0] === "audio"){
            mime = Mimetype.mp4Audio
          }
          xiedev.sendMessage(from, media, type, { quoted: xie, mimetype: mime, caption: text,contextInfo: {"mentionedJid": mids}})
                    
          fs.unlinkSync(filename)
         });
         }
			
			mess = {
				wait: '*Sedang Diproses*',
				sucess: '*Sukses*',
				error: {
					eror: '*Eror*',
					link: '*Link Invalid*'
				},
				only: {
					group: '*Khusus Group*',
					benned: '*Maaf Nomer Kamu Tidak Bisa Gunakan Xie Bot*',
					ownerG: '*Khusus Owner Group*',
					ownerXie: '*Khusus Owner Xie*',
					premium: '*Khusus Premium Xie*',
					userXie: `Hai ${pushname}\nKamu Belum Terdaftar\nSilahkan Ketik : ${prefix}daftar`,
					admin: '*Khusus Admin Group*',
					Badmin: '*Jadikan Xie Bot Admin Dulu*'
				}
			}
         
         if (itsMeXie){
         if(budy.toLowerCase() == `${prefix}self`){
         public = false
         reply(`Success`, `Status : Self`)
         }
         if (budy.toLowerCase() == 'status'){
         reply(`STATUS : ${public ? 'Public' : 'Self'}`)
         }
         }
         if (!public){
         if (!xie.key.fromMe) return
         }
         
			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			
            if (isCmd && !isGroup) console.log(color('[ CMD ]'), color(time, 'aqua'), color(`${command} [${args.length}]`), 'from', color(pushname))
            if (isCmd && isGroup) console.log(color('[ CMD ]'), color(time, 'aqua'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
			switch(command) {
			case 'menu':
			case 'help':
			     menunya = `
╭𖧹「 *INFO BOT* 」
┴𖧹
${fx} Author: FxSx
${fx} Nama Bot: Xie
${fx} Prefix: ${prefix}
┬𖧹
╰─────𖧹

╭𖧹「 *ABOUT* 」
┴𖧹
${fx} ${prefix}status
${fx} ${prefix}info
${fx} ${prefix}blocklist
${fx} ${prefix}listscmd
┬𖧹
╰─────𖧹

╭𖧹「 *GROUP* 」
┴𖧹
${fx} ${prefix}welcome on/off
${fx} ${prefix}add
${fx} ${prefix}kick
${fx} ${prefix}tagall
${fx} ${prefix}listadmin
${fx} ${prefix}pemilikgrup
┬𖧹
╰─────𖧹

╭𖧹「 *FUNNY* 」
┴𖧹
${fx} ${prefix}sticker
${fx} ${prefix}toimg
${fx} ${prefix}tts
┬𖧹
╰─────𖧹

╭𖧹「 *DOWNLOAD* 」
┴𖧹
${fx} ${prefix}play
${fx} ${prefix}ytsearch
${fx} ${prefix}ytmp3
${fx} ${prefix}ytmp4
${fx} ${prefix}fb
${fx} ${prefix}ig
${fx} ${prefix}igstalk
${fx} ${prefix}igstory
${fx} ${prefix}tiktok
┬𖧹
╰─────𖧹

╭𖧹「 *OWNER* 」
┴𖧹
${fx} ${prefix}setprefix
${fx} ${prefix}sethias
${fx} ${prefix}scmd
${fx} ${prefix}delcmd
${fx} ${prefix}clearall
${fx} ${prefix}bc
${fx} ${prefix}clone
┬𖧹
╰─────𖧹`
			     xiedev.sendMessage(from, menunya, text, {quoted: xie})
			     break
//>>>>>>>>>[ KHUSUS INFO BOT ]<<<<<<<<<<\\
         case 'status':
			     const status = public ? 'Public': 'Self'
			     return reply(`「 STATUS BOT 」\n\n ${status}`)
			     break
         case 'info':
              me = xiedev.user
              uptime = process.uptime()
              teks = `*Nama bot* : ${me.name}\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*The bot is active on* : ${kyun(uptime)}`
              buffer = await getBuffer(me.imgUrl)
              xiedev.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
              break
         case 'blocklist':
         case 'listblock':
              teks = 'Daftar Block :\n'
              for (let block of blocked) {
              teks += `~> @${block.split('@')[0]}\n`
              }
              teks += `Total : ${blocked.length}`
              xiedev.sendMessage(from, teks.trim(), extendedText, {quoted: xie, contextInfo: {"mentionedJid": blocked}})
              break
         case 'listscmd':
              let teksnyee = `「 LIST CMD STICKER 」`
              let cemde = [];
              for (let i of _stikcmd) {
              cemde.push(i.id)
              teksnyee += `\n\n*${fx} ID :* ${i.id}\n*${fx} Cmd :* ${i.chats}`
              }
              replyca(teksnyee)
              break
//>>>>>>>>>[ END INFO BOT ]<<<<<<<<<<\\

//>>>>>>>>>[ KHUSUS FUNNY ]<<<<<<<<<<\\
         case 'stiker':
         case 'sticker':
         case 'stik':
         case 'stick':
         case 's':
         case 'sgif':
         case 'stickergif':
              if ((isMedia && !xie.message.videoMessage || isQuotedImage) && args.length == 0) {
              const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(xie).replace('quotedM','m')).message.extendedTextMessage.contextInfo : xie
              const media = await xiedev.downloadAndSaveMediaMessage(encmedia)
              ran = getRandom('.webp')
              await ffmpeg(`./${media}`)
              .input(media)
              .on('start', function (cmd) {
              console.log(`Started : ${cmd}`)
              })
              .on('error', function (err) {
              console.log(`Error : ${err}`)
              fs.unlinkSync(media)
              reply(mess.error.eror)
              })
              .on('end', function () {
              console.log('Finish')
              buff = fs.readFileSync(ran)
              xiedev.sendMessage(from, buff, sticker, {quoted: xie})
              fs.unlinkSync(media)
              fs.unlinkSync(ran)
              })
              .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
              .toFormat('webp')
              .save(ran)
              } else if ((isMedia && xie.message.videoMessage.seconds < 11 || isQuotedVideo && xie.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
              const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(xie).replace('quotedM','m')).message.extendedTextMessage.contextInfo : xie
              const media = await xiedev.downloadAndSaveMediaMessage(encmedia)
              ran = getRandom('.webp')
              await ffmpeg(`./${media}`)
              .inputFormat(media.split('.')[1])
              .on('start', function (cmd) {
              console.log(`Started : ${cmd}`)
              })
              .on('error', function (err) {
              console.log(`Error : ${err}`)
              fs.unlinkSync(media)
              tipe = media.endsWith('.mp4') ? 'video' : 'gif'
              reply(`Eror Mengkonversi ${tipe} Ke Sticker`)
              })
              .on('end', function () {
              console.log('Finish')
              buff = fs.readFileSync(ran)
              xiedev.sendMessage(from, buff, sticker, {quoted: xie})
              fs.unlinkSync(media)
              fs.unlinkSync(ran)
              })
              .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
              .toFormat('webp')
              .save(ran)
              } else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
              const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(xie).replace('quotedM','m')).message.extendedTextMessage.contextInfo : xie
              const media = await xiedev.downloadAndSaveMediaMessage(encmedia)
              ranw = getRandom('.webp')
              ranp = getRandom('.png')
              keyrmbg = 'bcAvZyjYAjKkp1cmK8ZgQvWH'
              await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
              fs.unlinkSync(media)
              let buffer = Buffer.from(res.base64img, 'base64')
              fs.writeFileSync(ranp, buffer, (err) => {
              if (err) return reply(mess.error.eror)
              })
              exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
              fs.unlinkSync(ranp)
              if (err) return reply(mess.error.eror)
              buff = fs.readFileSync(ranw)
              xiedev.sendMessage(from, buff, sticker, {quoted: xie})
              })
              })
              } else {
              reply(`Kirim Gambar Caption ${prefix}sticker Atau Tag Gambar Yang Sudah Dikirim`)
              }
              break
         case 'toimg':
              if (!isQuotedSticker) return reply('Reply Stickernya')
              encmedia = JSON.parse(JSON.stringify(xie).replace('quotedM','m')).message.extendedTextMessage.contextInfo
              media = await xiedev.downloadAndSaveMediaMessage(encmedia)
              ran = getRandom('.png')
              exec(`ffmpeg -i ${media} ${ran}`, (err) => {
              fs.unlinkSync(media)
              if (err) return reply(mess.error.eror)
              buffer = fs.readFileSync(ran)
              xiedev.sendMessage(from, buffer, image, {quoted: xie, caption: '>//<'})
              fs.unlinkSync(ran)
              })
              break
         case 'tts':
              if (args.length < 1) return reply(`Kode Bahasanya Mana\nSilahkan Ketik : ${prefix}bahasa`)
              const gtts = require('./lib/gtts')(args[0])
              if (args.length < 2) return reply('Textnya Mana')
              dtt = body.slice(9)
              ranm = getRandom('.mp3')
              rano = getRandom('.ogg')
              dtt.length > 600
              ? reply('Textnya Kebanyakan')
              : gtts.save(ranm, dtt, function() {
              exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
              fs.unlinkSync(ranm)
              buff = fs.readFileSync(rano)
              if (err) return reply(mess.error.eror)
              xiedev.sendMessage(from, buff, audio, {quoted: xie, ptt:true})
              fs.unlinkSync(rano)
              })
              })
              break
//>>>>>>>>>[ END FUNNY ]<<<<<<<<<<\\

//>>>>>>>>>[ KHUSUS GROUP ]<<<<<<<<<<\\
         case 'tagall':
              if (!isGroup) return reply(mess.only.group)
              if (!isGroupAdmins) return reply(mess.only.admin)
              members_id = []
              teks = (args.length > 1) ? body.slice(8).trim() : ''
              teks += '\n\n'
              for (let mem of groupMembers) {
              teks += `*#* @${mem.jid.split('@')[0]}\n`
              members_id.push(mem.jid)
              }
              mentions(teks, members_id, true)
              break
         case 'add':
              if (!isGroup) return reply(mess.only.group)
              if (!isGroupAdmins) return reply(mess.only.admin)
              if (!isBotGroupAdmins) return reply(mess.only.Badmin)
              if (args.length < 1) return reply('Mau Add Siapa')
              if (args[0].startsWith('08')) return reply('Gunakan Kode Negara')
              try {
              num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
              xiedev.groupAdd(from, [num])
              } catch (e) {
              console.log('Error :', e)
              reply(mess.error.eror)
              }
              break
         case 'kick':
              if (!isGroup) return reply(mess.only.group)
              if (!isGroupAdmins) return reply(mess.only.admin)
              if (!isBotGroupAdmins) return reply(mess.only.Badmin)
              if (xie.message.extendedTextMessage === undefined || xie.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
              mentioned = xie.message.extendedTextMessage.contextInfo.mentionedJid
              if (mentioned.length > 1) {
              teks = 'Perintah di terima, mengeluarkan :\n'
              for (let _ of mentioned) {
              teks += `@${_.split('@')[0]}\n`
              }
              mentions(teks, mentioned, true)
              xiedev.groupRemove(from, mentioned)
              } else {
              mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
              xiedev.groupRemove(from, mentioned)
              }
              break
         case 'listadmins':
         case 'listadmin':
              if (!isGroup) return reply(mess.only.group)
              teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
              no = 0
              for (let admon of groupAdmins) {
              no += 1
              teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
              }
              mentions(teks, groupAdmins, true)
              break
         case 'ownergrup':
         case 'pemilikgrup':
         case 'pemilikgc':
              xie.updatePresence(from, Presence.composing) 
              options = {
              text: `Pemilik Group : wa.me/${from.split("-")[0]}`,
              contextInfo: { mentionedJid: [from] }
              }
              xiedev.sendMessage(from, options, text, {quoted: xie})
              break
         case 'welcome':
              if (!isGroup) return reply(mess.only.group)
              if (!isGroupAdmins) return reply(mess.only.admin)
              if (args.length < 1) return reply('On Mengaktifkan\nOff Menonaktifkan')
              if ((args[0]) === 'on') {
              if (isWelkom) return replyca('Welcome Sudah On')
              welkom.push(from)
              fs.writeFileSync('./database/welkom.json', JSON.stringify(welkom))
              reply('Sukses')
              } else if ((args[0]) === 'off') {
              if (isWelkom) return replyca('Welcome Sudah Off')
              welkom.splice(from, 1)
              fs.writeFileSync('./database/welkom.json', JSON.stringify(welkom))
              reply('Sukses')
              } else {
              reply('On Mengaktifkan\nOff Menonaktifkan')
              }
              break
//>>>>>>>>>[ END GROUP ]<<<<<<<<<<\\

//>>>>>>>>>[ KHUSUS DOWNLOAD ]<<<<<<<<<<\\
         case 'play':
              if (args.length === 0) return reply(`Silahkan Ketik : ${prefix}play Nama Lagunya`)
              var srch = args.join('')
              find = await yts(srch)
              res = find.all
              var reslink = res[0].url;
              try {
              yta(reslink)
              .then((res) => {
              const { dl_link, thumb, title, filesizeF, filesize } = res
              axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then(async (a) => {
              if (Number(filesize) >= 100000) return sendMediaURL(thumb, `*PLAY MUSIC*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam bentuk link_`)
              sendMediaURL(thumb, `*PLAY MUSIC*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n*Link* : ${a.data}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`)
              await sendMediaURL(dl_link).catch(() => reply(mess.error.eror))
              })
              })
              l} catch (e) {
              reply(mess.error.eror)
              }
              break
         case 'ytsearch':
              if (args.length < 1) return reply("masukan judul video")
              var search = args.join('')
              try {
              var find = await yts(search)
              } catch {
              return await reply(mess.error.eror)
              }
              result = find.all
              var tbuff = await getBuffer(result[0].image)
              var ytres = `*[ YT SEARCH ]*\n*————————————————————*\n\n`
              find.all.map((video) => {
              ytres += `${fx} Title:` + video.title + '\n'
              ytres += `❏ Link:` + video.url + '\n'
              ytres += `❏ Durasi:` + video.timestamp + '\n'
              ytres += `❏ Upload:` + video.ago +`\n*————————————————————*\n\n`
              })
              await fakethumb(tbuff, ytres)
              break
         case 'ytmp3':
              if (args.length < 1) return reply('masukan link youtube yang mau di download')
              var link = args[0].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
              if (!link) return reply("Linknya Mana")
              try {
              reply(mess.wait)
              yta(args[0])
              .then((res) =>{
              const { dl_link, thumb, title, filesizeF, filesize } = res
              axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then((a) => {
              if (Number(filesize) >= 30000) return sendMediaURL(thumb, `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam mektuk link_`)
              const caption = `*YTMP3*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
              sendMediaURL(thumb, caption)
              sendMediaURL(dl_link).catch(() => reply("File Eror"))
              })
              })
              } catch (e) {
              reply(mess.error.eror)
              }
              break
         case 'ytmp4':
              if (args.length < 1) return reply('masukan link youtube yang mau di download')
              var link = args[0].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
              if (!link) return reply("link yang anda masukan invalid")
              try {
              reply(mess.wait)
              ytv(args[0])
              .then((res) =>{
              const { dl_link, thumb, title, filesizeF, filesize } = res
              axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then((a) => {
              if (Number(filesize) >= 30000) return sendMediaURL(thumb, `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam mektuk link_`)
              const caption = `*YTMP4*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
              sendMediaURL(thumb, caption)
              sendMediaURL(dl_link).catch(() => reply("file error"))
              })
              })
              } catch (e) {
              reply(mess.error.eror)
              }
              break
         case 'fb':
              if (!isUrl(args[0]) && !args[0].includes('facebook.com') && args.length < 1) return reply("Link Eror")
              reply(mess.wait)
              hx.fbdown(args[0])
              .then(res => {
              link = `${res.HD}`
              sendMediaURL(link, `*Link video_normal* : ${re.Normal_video}`)
              })
              break
         case 'ig':
              if (!isUrl(args[0]) && !args[0].includes('instagram.com') && args.length < 1) return reply("coba check link nya")
              reply(mess.wait)
              hx.igdl(args[0])
              .then(async (res) => {
              for (let i of res.medias) {
              if (i.url.includes("mp4")){
              let bufff = await getBuffer(i.url)
              xiedev.sendMessage(from, bufff, video, {quoted: xie, caption: `Type : ${i.type}`})
              } else {
              let buff = await getBuffer(i.url)
              xiedev.sendMessage(from, buff, image, {quoted: xie, caption: `Type : ${i.type}`})
              }
              }
              })
              break
         case 'igstalk':
              if (args.length < 1) return reply("Masukan Nama IG Nya")
              ig.fetchUser(args[0])
              .then(user => {
              thum = `${user.profile_pic_url_hd}`
              desc = `*ID* : ${user.profile_id}\n*Username* : ${args.join('')}\n*Full Name* : ${user.full_name}\n*Bio* : ${user.biography}\n*Followers* : ${user.followers}\n*Following* : ${user.following}\n*Private* : ${user.is_private}\n*Verified* : ${user.is_verified}\n\n*Link* : https://instagram.com/${args.join('')}`
              sendMediaURL(thum, desc)
              })
              break
         case 'igstory':
              if(!q) return reply('Masukan Nama IG Nya')
              hx.igstory(q)
              .then(async result => {
              for(let i of result.medias){
              if(i.url.includes('mp4')){
              let bufff = await getBuffer(i.url)
              xiedev.sendMessage(from, bufff, video, {quoted: xie, caption: `Type : ${i.type}`})
              } else {
              let buff = await getBuffer(i.url)
              xiedev.sendMessage(from, buff, image, {quoted: xie, caption: `Type : ${i.type}`})                  
              }
              }
              });
              break
         case 'tiktok':
              if (!isUrl(args[0]) && !args[0].includes('tiktok.com') && !q) return reply("link tiktok nya tuan")
              sek = await reply(mess.wait)
              hx.ttdownloader(args[0])
              .then(res => {
              const {
              nowm
              } = res;
              axios.get(`https://tinyurl.com/api-create.php?url=${nowm}`)
              .then(async (a) => {
              me = `link: ${a.data}`
              xiedev.sendMessage(from,{url:`${nowm}`},video,{mimetype:'video/mp4',quoted:xie,caption:me})
              setTimeout(() => {
              xiedev.deleteMessage(from, sek.key)
              }, 10000)
              })
              })
              .catch( e => console.log(e))
              break
//>>>>>>>>>[ END DOWNLOAD ]<<<<<<<<<<\\

//>>>>>>>>>[ KHUSUS OWNER ]<<<<<<<<<<\\
         case 'self':
              if (!isOwner && !xie.key.fromMe) return reply(mess.only.ownerXie)
              public = false
              return reply(`*MODE : SELF*`)
              break
			case 'public':
              if (!isOwner && !xie.key.fromMe) return reply(mess.only.ownerXie)
              public = true
              return reply(`*MODE : PUBLIC*`)
              break
         case 'setprefix':
              if (!isOwner) return reply(mess.only.ownerXie)
              if (args.length < 1) return reply('Textnya Mana')
              prefix = args[0]
              reply(`Sukses Set Menjadi : ${prefix}`)
              break
         case 'sethias':
         case 'sethiasan':
              if (!isOwner) return reply(mess.only.ownerXie)
              if (args.length < 1) return reply('Textnya Mana')
              fx = args[0]
              reply(`Sukses Set Menjadi : ${fx}`)
              break
         case 'clearall':
              if (!isOwner) return reply(mess.only.ownerXie)
              anu = await xiedev.chats.all()
              xiedev.setMaxListeners(25)
              for (let _ of anu) {
              xiedev.deleteChat(_.jid)
              }
              reply('Sukses')
              break
         case 'bc':
              if (!isOwner) return reply(mess.only.ownerXie)
              if (args.length < 1) return reply('Textnya Mana')
              anu = await xiedev.chats.all()
              if (isMedia && !xie.message.videoMessage || isQuotedImage) {
              const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(xie).replace('quotedM','m')).message.extendedTextMessage.contextInfo : xie
              buff = await xiedev.downloadMediaMessage(encmedia)
              for (let _ of anu) {
              xiedev.sendMessage(_.jid, buff, image, {caption: `[ Ini Broadcast ]\n\n${body.slice(4)}`})
              }
              reply('Sukses')
              } else {
              for (let _ of anu) {
              sendMess(_.jid, `[ Ini Broadcast ]\n\n${body.slice(4)}`)
              }
              reply('Sukses')
              }
              break
         case 'clone':
              if (!isOwner) return reply(mess.only.ownerXie)
              if (args.length < 1) return reply('Tag target yang ingin di clone')
              if (xie.message.extendedTextMessage === undefined || xie.message.extendedTextMessage === null) return reply('Tag cvk')
              mentioned = xie.message.extendedTextMessage.contextInfo.mentionedJid[0]
              let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
              try {
              pp = await xiedev.getProfilePicture(id)
              buffer = await getBuffer(pp)
              xiedev.updateProfilePicture(botNumber, buffer)
              mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
              } catch (e) {
              reply(mess.error.eror)
              }
              break
         case 'scmd':
              if (!isOwner && !xie.key.fromMe) return reply(mess.only.ownerXie)
              if (isQuotedSticker) {
              if (!q) return reply(`Penggunaan : ${prefix + command} cmdnya dan tag stickernya`)
              var kodenya = xie.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString('base64')
              sCmd(kodenya, q)
              reply('Done!')
              } else {
              reply('Reply Stickernya')
              }
              break
          case 'delcmd':
              if (!isOwner && !xie.key.fromMe) return reply(mess.only.ownerXie)
              if (!isQuotedSticker) return reply(`Penggunaan : ${prefix + command} tagsticker`)
              var kodenya = xie.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.fileSha256.toString('base64')
              _stikcmd.splice(getCommandPosition(kodenya), 1)
              fs.writeFileSync('./database/scmd.json', JSON.stringify(_stikcmd))
              reply('Sukses')
              break
//>>>>>>>>>[ END OWNER ]<<<<<<<<<<\\
         default:
              if (isGroup && budy != undefined) {
              } else {
              console.log(color('[XIE-BOT]','red'), 'Tidak Ada Perintah', color(sender.split('@')[0]))
              }
              }
		        } catch (e) {
			     console.log('Error : %s', color(e, 'red'))
         }
	 })
}
starts()
