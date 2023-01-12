import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { Request } from '../src/Request';

test('compute a standard request', () => {
	const request = new Request('GetVolleyTransferList', ['No']);

	assert.equal(request.toString(), '<Request Type="GetVolleyTransferList" Properties="No"></Request>');
});

test('compute a standard request with no properties', () => {
	const request = new Request('GetVolleyTransferList');

	assert.equal(request.toString(), '<Request Type="GetVolleyTransferList"></Request>');
});

test('let us use the old properties tag', () => {
	const request = new Request('GetVolleyTransferList', ['No'], 'Fields');

	assert.equal(request.toString(), '<Request Type="GetVolleyTransferList" Fields="No"></Request>');
});

test('clone request', () => {
	const request = new Request('GetVolleyTransferList');
	const request2 = request.clone().addRootAttribute('No', 1);
	assert.not.equal(request.toString(), request2.toString());
});

test('compute multiple attributes', () => {
	const request = new Request('GetVolleyTransferList', ['No']).addRootAttribute('Version', 0);

	assert.equal(request.toString(), '<Request Type="GetVolleyTransferList" Properties="No" Version="0"></Request>');
});

test('compute attributes with null values', () => {
	const request = new Request('SavePlayer').addNode('Player', {
		FirstName: null,
	});

	assert.equal(request.toString(), '<Request Type="SavePlayer"><Player FirstName=""/></Request>');
});

test('compute attributes with boolean values', () => {
	const request = new Request('SaveArticle').addNode('Article', {
		IsVideoLive: true,
	});

	assert.equal(request.toString(), '<Request Type="SaveArticle"><Article IsVideoLive="true"/></Request>');
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

test('compute both filter system', () => {
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

test('compute relations with custom attributes', () => {
	const request = new Request('GetVolleyClubTeamList')
		.addRelation('ChampionshipAt', null, { Date: '2020-07-01' })
		.addRelation('ChampionshipAt.Championship.Division', ['Name']);

	assert.equal(
		request.toString(),
		'<Request Type="GetVolleyClubTeamList"><Relation Name="ChampionshipAt" Date="2020-07-01"><Relation Name="Championship"><Relation Name="Division" Properties="Name"/></Relation></Relation></Request>'
	);
});

test('compute query with custom nodes', () => {
	const request = new Request('SaveVolleyTransferContract').addNode('VolleyTransferContract', {
		StartOn: '2020-07-01',
	});

	assert.equal(
		request.toString(),
		'<Request Type="SaveVolleyTransferContract"><VolleyTransferContract StartOn="2020-07-01"/></Request>'
	);
});

test('compute query with deep custom nodes', () => {
	const request = new Request('SaveArticle')
		.addNode('Article', {
			DateTime: '2020-07-01',
		})
		.addNode('Article.ArticleText', { Headline: 'Test' });

	assert.equal(
		request.toString(),
		'<Request Type="SaveArticle"><Article DateTime="2020-07-01"><ArticleText Headline="Test"/></Article></Request>'
	);
});

test('compute query with special characters', () => {
	const request = new Request('SaveArticle').addNode('Article', {
		Title: '<something>ba"d&',
	});

	assert.equal(
		request.toString(),
		'<Request Type="SaveArticle"><Article Title="&lt;something&gt;ba&quot;d&amp;"/></Request>'
	);
});

test('compute query with custom node with children', () => {
	const request = new Request('SavePlayer')
		.addNode('Player', { No: 1 })
		.addNode('Player.Photo', { Extension: 'png' }, 'Something');

	assert.equal(
		request.toString(),
		'<Request Type="SavePlayer"><Player No="1"><Photo Extension="png">Something</Photo></Player></Request>'
	);
});

test.run();
