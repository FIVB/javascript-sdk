import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { Request } from '../src/Request.js';

test('compute a standard request', () => {
	const request = new Request('GetVolleyTransferList', ['No']);

	assert.equal(request.toString(), '<Request Type="GetVolleyTransferList" Properties="No"></Request>');
});

test('let us use the old properties tag', () => {
	const request = new Request('GetVolleyTransferList', ['No'], 'Fields');

	assert.equal(request.toString(), '<Request Type="GetVolleyTransferList" Fields="No"></Request>');
});

test('compute multiple attributes', () => {
	const request = new Request('GetVolleyTransferList', ['No']).addRootAttribute('Version', 0);

	assert.equal(request.toString(), '<Request Type="GetVolleyTransferList" Properties="No" Version="0"></Request>');
});

test('compute relation', () => {
	const request = new Request('GetVolleyTransferList', ['No']).addRelation('Season', ['Name']);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyTransferList" Properties="No"><Relation Name="Season" Properties="Name"/></Request>'
	);
});

test('compute relation with the old properties tag', () => {
	const request = new Request('GetVolleyTransferList', ['No'], 'Fields').addRelation('Season', ['Name']);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyTransferList" Fields="No"><Relation Name="Season" Fields="Name"/></Request>'
	);
});

test('compute nested relation', () => {
	const request = new Request('GetVolleyTransferList', ['No'])
		.addRelation('Player', ['No'])
		.addRelation('Player.Federation', ['Code']);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyTransferList" Properties="No"><Relation Name="Player" Properties="No"><Relation Name="Federation" Properties="Code"/></Relation></Request>'
	);
});

test('compute deeply nested relation', () => {
	const request = new Request('GetVolleyTransferList', ['No'])
		.addRelation('Player', ['No'])
		.addRelation('Player.Federation', ['Code'])
		.addRelation('Player.Federation.Confederation', ['Name']);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyTransferList" Properties="No"><Relation Name="Player" Properties="No"><Relation Name="Federation" Properties="Code"><Relation Name="Confederation" Properties="Name"/></Relation></Relation></Request>'
	);
});

test('compute deeply nested relation 2', () => {
	const request = new Request('GetVolleyTransferList', ['No'])
		.addRelation('Player', ['No'])
		.addRelation('Player.Federation.Confederation', ['Name']);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyTransferList" Properties="No"><Relation Name="Player" Properties="No"><Relation Name="Federation"><Relation Name="Confederation" Properties="Name"/></Relation></Relation></Request>'
	);
});

test('compute inline filters', () => {
	const request = new Request('GetVolleyTransferList', ['No']).addInlineFilter('Statuses', 30);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyTransferList" Properties="No"><Filter Statuses="30"/></Request>'
	);
});

test('compute multiple inline filters', () => {
	const request = new Request('GetVolleyTransferList', ['No'])
		.addInlineFilter('Statuses', 30)
		.addInlineFilter('NoSeason', 11);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyTransferList" Properties="No"><Filter Statuses="30" NoSeason="11"/></Request>'
	);
});

test('compute tag filters', () => {
	const request = new Request('GetArticleList', ['No'], 'Fields').addTagFilter('player:123');

	assert.equal(
		request.toString(),
		'<Request Type="GetArticleList" Fields="No"><Filter><Tags Mode="MySqlBoolean">player:123</Tags></Filter></Request>'
	);
});

test('compute multiple tag filters', () => {
	const request = new Request('GetArticleList', ['No'], 'Fields')
		.addTagFilter('player:123')
		.addTagFilter('player:1234');

	assert.equal(
		request.toString(),
		'<Request Type="GetArticleList" Fields="No"><Filter><Tags Mode="MySqlBoolean">player:123 player:1234</Tags></Filter></Request>'
	);
});

test('compute both filter sytem', () => {
	const request = new Request('GetArticleList', ['No'], 'Fields')
		.addInlineFilter('Statuses', 30)
		.addInlineFilter('NoSeason', 11)
		.addTagFilter('player:123')
		.addTagFilter('player:1234');

	assert.equal(
		request.toString(),
		'<Request Type="GetArticleList" Fields="No"><Filter Statuses="30" NoSeason="11"><Tags Mode="MySqlBoolean">player:123 player:1234</Tags></Filter></Request>'
	);
});

test.run();
