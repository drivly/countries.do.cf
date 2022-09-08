import flatten from 'flat'

export default {
  fetch: (req, env) => env.COUNTRIES.get(env.COUNTRIES.idFromName(req.cf.colo)).fetch(req)
}

export class Countries {
  constructor(state, env) {
    this.state = state
    this.state.blockConcurrencyWhile(async () => {
      const init = await this.state.storage.get('Aruba')
      if (!init) {
        const countries = await fetch('https://countries.do.cf/countries.json').then(res => res.json())
        countries.map(country => {
          this.state.storage.put(country.name.common, country)
          Object.entries(flatten(country, { safe: true })).map(([key, value]) => Array.isArray(value) ? 
               value.map(arrayValue => this.state.storage.put(`${key}: ${arrayValue} -> ${country.name.common}`, 'https://countries.do.cf/' + country.name.common)) :
               this.state.storage.put(`${key}: ${value} -> ${country.name.common}`, 'https://countries.do.cf/' + country.name.common))
        })
      }
    })
  }
  async fetch(req) {
    const { pathname, search, searchParams } = new URL(req.url)
    const options = Object.fromEntries(searchParams)
    const country = decodeURI(pathname.split('/')[1])
    const data = country ? await this.state.storage.get(country) : 
                           await this.state.storage.list(options).then(list => Object.fromEntries(list)) 
    return new Response(JSON.stringify({ 
      api: {
        name: 'countries.do.cf',
        icon: '🌎',
        endpoints: {
          countries: 'https://countries.do.cf/?prefix=name.common',
          altSpellings: 'https://countries.do.cf/?prefix=altSpellings',
          borders: 'https://countries.do.cf/?prefix=borders', 
        }
      },
      country,
      options,
      data,
      user: {
        
      }
    }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  }
}

// const flatten = (obj, roots=[], sep='.') => Object.keys(obj).reduce((memo, prop) => Object.assign({}, memo, Object.prototype.toString.call(obj[prop]) === '[object Object]' ? flatten(obj[prop], roots.concat([prop]), sep) : {[roots.concat([prop]).join(sep)]: obj[prop]}), {})
