import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize} from './market.js';
test('calculates daily change against provider previous close and excludes incomplete candles',()=>{
 const result=normalize({meta:{symbol:'TEST',regularMarketPrice:110,chartPreviousClose:100,regularMarketTime:123},timestamp:[1,2],indicators:{quote:[{open:[100,null],high:[111,112],low:[99,100],close:[110,111],volume:[20,30]}]}});
 assert.equal(result.percent,10);assert.equal(result.change,10);assert.equal(result.bars.length,1);assert.equal(result.time,123);
});
test('rejects incomplete prices instead of manufacturing a quote',()=>{assert.throws(()=>normalize({meta:{regularMarketPrice:5},indicators:{}}),/incomplete/)});
