# countries.do.cf
Countries Database Example in Cloudflare Durable Objects


<https://countries.do.cf/Aruba>

<https://countries.do.cf/?prefix=name.common>

<https://countries.do.cf/?prefix=name.common&limit=5&skip=5&start=name.common:+N>


## Example of DO List issue with start when `reverse: true`

This works as expected:
<https://countries.do.cf/?start=borders:+M&limit=10>
```
{
  "borders: MAC -> China": "https://countries.do.cf/China",
  "borders: MAF -> Sint Maarten": "https://countries.do.cf/Sint Maarten",
  "borders: MAR -> Algeria": "https://countries.do.cf/Algeria",
  "borders: MAR -> Spain": "https://countries.do.cf/Spain",
  "borders: MAR -> Western Sahara": "https://countries.do.cf/Western Sahara",
  "borders: MCO -> France": "https://countries.do.cf/France",
  "borders: MDA -> Romania": "https://countries.do.cf/Romania",
  "borders: MDA -> Ukraine": "https://countries.do.cf/Ukraine",
  "borders: MEX -> Belize": "https://countries.do.cf/Belize",
  "borders: MEX -> Guatemala": "https://countries.do.cf/Guatemala"
}
```

When `reverse=true` is added to the `list({reverse: true})` the behavior is not what is expected:
<https://countries.do.cf/?start=borders:+M&limit=10&reverse=true>
```
{
  "Åland Islands": { 
    ...
  },
  "unMember: true -> Zimbabwe": "https://countries.do.cf/Zimbabwe",
  "unMember: true -> Zambia": "https://countries.do.cf/Zambia",
  "unMember: true -> Yemen": "https://countries.do.cf/Yemen",
  "unMember: true -> Vietnam": "https://countries.do.cf/Vietnam",
  "unMember: true -> Venezuela": "https://countries.do.cf/Venezuela",
  "unMember: true -> Vatican City": "https://countries.do.cf/Vatican City",
  "unMember: true -> Vanuatu": "https://countries.do.cf/Vanuatu",
  "unMember: true -> Uzbekistan": "https://countries.do.cf/Uzbekistan",
  "unMember: true -> Uruguay": "https://countries.do.cf/Uruguay"
}
```

While this is what would be expected:
```
{
  "borders: MYS -> Thailand": "https://countries.do.cf/Thailand",
  "borders: MYS -> Indonesia": "https://countries.do.cf/Indonesia",
  "borders: MYS -> Brunei": "https://countries.do.cf/Brunei",
  "borders: MWI -> Zambia": "https://countries.do.cf/Zambia",
  "borders: MWI -> Tanzania": "https://countries.do.cf/Tanzania",
  "borders: MWI -> Mozambique": "https://countries.do.cf/Mozambique",
  "borders: MRT -> Western Sahara": "https://countries.do.cf/Western Sahara",
  "borders: MRT -> Senegal": "https://countries.do.cf/Senegal",
  "borders: MRT -> Mali": "https://countries.do.cf/Mali",
  "borders: MRT -> Algeria": "https://countries.do.cf/Algeria",
}
```

It's clear that the initial filter is occuring before the reverse sort:
<https://countries.do.cf/?prefix=borders&start=borders:+ZV&reverse=true>
```
{
  "borders: ZWE -> Zambia": "https://countries.do.cf/Zambia",
  "borders: ZWE -> South Africa": "https://countries.do.cf/South Africa",
  "borders: ZWE -> Mozambique": "https://countries.do.cf/Mozambique",
  "borders: ZWE -> Botswana": "https://countries.do.cf/Botswana"
}
```


It's also clear that the `prefix` argument is applied before `reverse` but after `start`
<https://countries.do.cf/?prefix=borders&start=borders:+M&limit=10&reverse=true>
```
{
  "borders: ZWE -> Zambia": "https://countries.do.cf/Zambia",
  "borders: ZWE -> South Africa": "https://countries.do.cf/South Africa",
  "borders: ZWE -> Mozambique": "https://countries.do.cf/Mozambique",
  "borders: ZWE -> Botswana": "https://countries.do.cf/Botswana",
  "borders: ZMB -> Zimbabwe": "https://countries.do.cf/Zimbabwe",
  "borders: ZMB -> Tanzania": "https://countries.do.cf/Tanzania",
  "borders: ZMB -> Namibia": "https://countries.do.cf/Namibia",
  "borders: ZMB -> Mozambique": "https://countries.do.cf/Mozambique",
  "borders: ZMB -> Malawi": "https://countries.do.cf/Malawi",
  "borders: ZMB -> DR Congo": "https://countries.do.cf/DR Congo"
}
```
