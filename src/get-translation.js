
import fetch from 'isomorphic-unfetch'
/**
 * 
 * @param {string} lang 目标语言
 * @param {string|string[]} files translate filepath / namespaces / ns
 * @param {Request} req Request 对象来自express
 * @return {i18n}  
 */
const getTranslation = (baseUrl) => {
  return async function getTranslation(lang, files, req) {

    if (!Array.isArray(files)) files = [files]

    var langData = {}
    await Promise.all(files.map(async (file) => {
      var json = await getNS(lang, file, req)
      langData[file] = json
      return true
    }))

    return {
      [lang]: langData
    }
  }

  async function getNS(lang, ns, req, ) {
    var r = await fetch(apiUrls(`${baseUrl}/${lang}/${ns}.json`, req), {}, req)
    var json = await r.json()
    return json
  }
}


export function apiUrls(path, req) {
  return req ? req.protocol + '://' + req.get('host') + path : path
}

export default getTranslation