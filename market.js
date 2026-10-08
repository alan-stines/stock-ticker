export function normalize(result) {
  const m=result.meta||{}, q=result.indicators?.quote?.[0]||{};
  const bars=(result.timestamp||[]).map((time,i)=>({time,open:q.open?.[i],high:q.high?.[i],low:q.low?.[i],close:q.close?.[i],volume:q.volume?.[i]})).filter(b=>[b.open,b.high,b.low,b.close].every(Number.isFinite));
  const price=m.regularMarketPrice;
  const previous=m.chartPreviousClose??m.previousClose;
  if (!Number.isFinite(price)||!Number.isFinite(previous)||previous<=0) throw new Error('Provider returned incomplete quote data');
  return {symbol:m.symbol,name:m.longName||m.shortName||m.symbol,currency:m.currency||'USD',price,previous,change:price-previous,percent:(price-previous)/previous*100,time:m.regularMarketTime,exchange:m.exchangeName,volume:m.regularMarketVolume??null,high:m.regularMarketDayHigh??null,low:m.regularMarketDayLow??null,bars,source:'Yahoo Finance public chart endpoint',timing:'Provider snapshot · may be delayed'};
}
