/*! burglebrostwo 2024-04-03 */
var CharacterPanelView=function(e,t){console.log("CharacterPanelView ctor()");var o=$("player_boards").firstElementChild.id.split("_").slice(-1).pop(),n=parseInt(o)+1;if(a=$("player_boards").firstElementChild){for(var a=a.cloneNode(!0),i=(a.id="overall_player_board_"+n,a.getElementsByTagName("*")),r=0;r<i.length;r++){var s=i[r];s.id=s.id.replace(o,""+n),"IMG"===s.tagName?s.src="":"A"===s.tagName&&((s=s).href="#player_board_"+n,s.innerHTML=t.characterName+" ("+t.playerName+")",s.target="",s.style.color="#0000ff")}dojo.place(a,$("player_boards"),"last"),this.el=a,dojo.place(e.format_block("jstpl_character_panel",{id:t.id}),this.el),this.heatZone=new ebg.zone,this.heatZone.create(e,"character_panel_"+t.id+"_heat",24,24),this.heatZone.setPattern("grid");for(r=0;r<6;++r){var l=dojo.place('<div class="icon-counting-cube token-heat token-heat-active"></div>',"character_panel_"+t.id+"_heat");this.heatZone.placeInZone(l)}this.tokenZone=new ebg.zone,this.tokenZone.create(e,"character_panel_"+t.id+"_tokens",24,24),this.tokenZone.setPattern("grid")}},CustomModule=function(){function e(){}return e.prototype.setup=function(e){this.gamedatas=e,console.log("hello from setup of MyFoo")},e}(),FloorView=function(){},FloorPreviewView=function(){function e(e,t,o){}return e.prototype.updateTile=function(e,t){},e.prototype.update=function(e,t){},e}(),__extends=(define(["dojo","dojo/_base/declare","ebg/core/gamegui","ebg/counter","ebg/stock","ebg/zone"],function(e,t){t("bgagame.burglebrostwo",ebg.core.gamegui,new GameBody)}),this&&this.__extends||function(){var n=function(e,t){return(n=Object.setPrototypeOf||({__proto__:[]}instanceof Array?function(e,t){e.__proto__=t}:function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}))(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}}()),GameBasics=function(t){function e(){var e=t.call(this)||this;return console.log("game constructor"),e.curstate=null,e.pendingUpdate=!1,e.currentPlayerWasActive=!1,e}return __extends(e,t),e.prototype.triggerUpdateActionButtons=function(){this.updatePageTitle()},e.prototype.setup=function(e){console.log("(BASICS) Starting game setup",gameui),this.gamedatas=e},e.prototype.onEnteringState=function(e,t){this.curstate=e,t=t?t.args:null,this.callfn("onEnteringState_"+e,t),this.pendingUpdate&&(this.onUpdateActionButtons(e,t),this.pendingUpdate=!1)},e.prototype.onLeavingState=function(e){this.currentPlayerWasActive=!1},e.prototype.onUpdateActionButtons=function(e,t){console.log("(BASICS) onUpdateActionButtons()"),this.curstate!=e?this.pendingUpdate=!0:(this.pendingUpdate=!1,gameui.isCurrentPlayerActive()&&0==this.currentPlayerWasActive?(console.log("onUpdateActionButtons: "+e,t,this.debugStateInfo()),this.currentPlayerWasActive=!0,this.callfn("onUpdateActionButtons_"+e,t)):this.currentPlayerWasActive=!1)},e.prototype.debugStateInfo=function(){var e=gameui.isCurrentPlayerActive(),t=!1;return"undefined"!=typeof g_replayFrom&&(t=!0),{isCurrentPlayerActive:e,instantaneousMode:!!gameui.instantaneousMode,replayMode:t}},e.prototype.ajaxcallwrapper=function(e,t,o){(t=t||{}).lock=!0,gameui.checkAction(e)&&gameui.ajaxcall("/"+gameui.game_name+"/"+gameui.game_name+"/"+e+".html",t,gameui,function(e){},o)},e.prototype.createHtml=function(e,t){var o=document.createElement("div"),e=(o.innerHTML=e,o.firstElementChild),o=document.getElementById(t);return o&&o.appendChild(e),e},e.prototype.createDiv=function(e,t,o){var n=document.createElement("div"),e=(e&&(n.id=e),t&&(e=n.classList).add.apply(e,t.split(" ")),document.getElementById(o));return e&&e.appendChild(n),n},e.prototype.callfn=function(e,t){if(void 0!==this[e])return console.log("Calling "+e,t),this[e](t)},e.prototype.onScriptError=function(e,t,o){if(!gameui.page_is_unloading)return console.error(e),this.inherited(arguments)},e}(GameGui=function(){}),__extends=this&&this.__extends||function(){var n=function(e,t){return(n=Object.setPrototypeOf||({__proto__:[]}instanceof Array?function(e,t){e.__proto__=t}:function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}))(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)}}();function isEntity(e){return void 0!==e.entityClass}var GameBody=function(r){function e(){var e=this;return console.log("burglebrostwo constructor"),(e=r.call(this)||this).nextCardUniqueId=0,e.selectedTile=null,console.log(e),e.zones={tile_tokens:{},tile_meeples:{}},e.playerCharacter={},e.characterPanel={},e}return __extends(e,r),e.prototype.setup=function(e){r.prototype.setup.call(this,e),console.log("setup(): gamedatas:"),console.log(e),this.setupStaticData(),this.setupBoard(e),this.setupPlayers(e);for(var t=0,o=e.characters;t<o.length;t++){var n=o[t];console.log("setup(): for player character..."),console.log(n),this.playerCharacter[n.id]=new PlayerCharacterView(this,n),this.characterPanel[n.id]=new CharacterPanelView(this,n)}this.setupNotifications(),this.panelManager=new PanelManager(this,e),console.log("setup: done()"),console.log("setup: this.player_id="+this.player_id)},e.prototype.setupBoard=function(e){for(var t=0,o=Object.values(e.gamemap.floors);t<o.length;t++){var n=o[t];console.log("*** setupBoard"),console.log(s),console.log(n);for(var a=0,i=n.tiles;a<i.length;a++){var r=i[a],s=(console.log(r),r.pos[0],r.pos[1],r.pos[2]);this.createTileContainer(r),this.playTileOnTable(r)}}for(var l=0,c=e.entities;l<c.length;l++){var d=c[l];this.createEntity(d)}for(var p=0,u=Object.entries(e.gamemap.floors);p<u.length;p++)for(var h=u[p],g=(h[0],0),y=(n=h[1]).walls;g<y.length;g++){var f=y[g];this.createWall(f)}},e.prototype.setupPlayers=function(e){console.log("cardsPerRow: "+StaticData.cardsPerRow),this.playerHand=this.createHandStock($("myhand"),"handleCardSelected")},e.prototype.createHandStock=function(e,t){if(void 0===e||null==e)throw"Oops: cannot `createHandStock()` with null div.";var o=new ebg.stock;o.create(this,e,125,125),o.image_items_per_row=StaticData.cardsPerRow,o.centerItems=!0,o.setSelectionMode(1),o.setSelectionAppearance("class"),dojo.connect(o,"onChangeSelection",this,t);return o.addItemType(42,42,g_gamethemeurl+"img/cards.jpg",3),this.loadCardTypes(o),o},e.prototype.setupStaticData=function(){console.log("setupStaticData()...");for(var e=0,t=Object.entries(StaticData.cardImageIds);e<t.length;e++)for(var o=t[e],n=o[0],o=o[1],a=0,i=Object.entries(o);a<i.length;a++){var r=i[a],s=r[0];r[1];this.getCardUniqueId(n,s)}},e.prototype.loadCardTypes=function(e){for(var t=0,o=Object.entries(this.cardTypesByUniqueId);t<o.length;t++){var n=o[t],a=n[0],n=n[1],n=StaticData.cardImageIds[n.cardTypeGroup][n.cardType];if(void 0===n)throw"Cannot load static data: card type has undefined image index.";e.addItemType(a,a,g_gamethemeurl+"img/cards.jpg",n)}},e.prototype.getCardUniqueId=function(e,t){void 0===this.cardUniqueIds&&(this.cardUniqueIds={}),void 0===this.cardTypesByUniqueId&&(this.cardTypesByUniqueId={});var o,n={cardTypeGroup:e,cardType:t};return void 0===this.cardUniqueIds[e]&&(this.cardUniqueIds[e]={}),void 0===this.cardUniqueIds[e][t]&&(void 0===this.nextCardUniqueId&&(this.nextCardUniqueId=0),o=this.nextCardUniqueId++,this.cardUniqueIds[e][t]=o,this.cardTypesByUniqueId[o]=n),this.cardUniqueIds[e][t]},e.prototype.handleCardSelected=function(e,t){console.log("handleCardSelected",e,t);e=this.playerHand;e.isSelected(t)&&this.checkAction("actPlayCard")?this.ajaxcall("/burglebrostwo/burglebrostwo/actPlayCard.html",{lock:!0,cardId:t},this,console.log,console.error):e.isSelected(t)},e.prototype.createTileContainer=function(e){var t=e.pos[0],o=e.pos[1],e=e.pos[2],n=t+"_"+o+"_"+e,a="tile_"+n;dojo.place(this.format_block("jstpl_tile_container",{divId:a,x:156*t,y:156*o,name:"Foobar"}),"floor"+(e+1)),dojo.connect($(a+"_container"),"onclick",this,function(e){console.log("*** onclick event"),this.handleTileClick(e,n)}),(t=new ebg.zone).create(this,"tile_"+n+"_tokens",24,24),t.setPattern("grid"),this.zones.tile_tokens[n]=t,(t=new ebg.zone).create(this,"tile_"+n+"_meeples",35,50),t.setPattern("grid"),this.zones.tile_meeples[n]=t},e.prototype.playTileOnTable=function(e){var t=e.pos[0],o=e.pos[1],n=e.pos[2],a="tile_"+t+"_"+o+"_"+n,t="tile_preview_"+t+"_"+o+"_"+n;switch($(a)&&dojo.destroy(a),$(t)&&dojo.destroy(t),e.state){case"HIDDEN":dojo.place(this.format_block("jstpl_tile",{divId:a,name:"Foobar42",extra_classes:["icon-tile_back"]}),a+"_container");break;case"VISIBLE":dojo.place(this.format_block("jstpl_tile",{divId:a,name:"Foobar42",extra_classes:["icon-tile_"+e.type.toLowerCase()]}),a+"_container");break;default:console.log("unexpected tile state!")}},e.prototype.createWall=function(e){e.id;var t=e.pos[1],o=156*e.pos[0],t=156*t;e.vertical?(t+=20,o+=143):(o+=10,t+=152);var n="floor"+(e.pos[2]+1);$(n)?dojo.place(this.format_block("jstpl_wall",{wallId:e.id,wallDirection:e.vertical?"vertical":"horizontal",x:o,y:t}),n):console.log("*** ERROR: could not find floor container for wall: "+n)},e.prototype.getCssClassForEntity=function(e){return"HIDDEN"==e.state?"icon-"+e.entityClass.toLowerCase()+"_back":"CHARACTER"==e.entityClass?"icon-"+e.character.appearance.toLowerCase():"DESTINATION"==e.entityClass?"icon-meeple_destination":"icon-"+e.entityType.toLowerCase()},e.prototype.getZoneForEntity=function(e){var t=e.pos[0]+"_"+e.pos[1]+"_"+e.pos[2];switch(e.entityType){case"DESTINATION":case"CHARACTER":case"CHIP":return this.zones.tile_meeples[t];default:return this.zones.tile_tokens[t]}},e.prototype.createEntity=function(e){dojo.place(this.format_block("jstpl_entity",{entityId:e.id,extraClasses:[this.getCssClassForEntity(e)]}),"tile_"+e.pos[0]+"_"+e.pos[1]+"_"+e.pos[2]+"_tokens"),this.getZoneForEntity(e).placeInZone(this.getEntityElId(e))},e.prototype.updateEntity=function(e){console.log("updateEntity(): enter"),console.log(e),console.log("  updateEntity destination pos = "),console.log(e.pos);this.getTileTokensEl(e.pos);this.getZoneForEntity(e).placeInZone(this.getEntityElId(e));var t=this.getEntityEl(e);if(console.log(t),null==t)throw"Got entity update, but was unable to retrieve corresponding DOM element.";for(var o=0,n=Array.prototype.slice.call(t.classList);o<n.length;o++){var a=n[o];a.match(/^icon-/)&&t.classList.remove(a)}t.classList.add(this.getCssClassForEntity(e))},e.prototype.despawnEntity=function(e){this.fadeOutAndDestroy(this.getEntityElId(e))},e.prototype.updateTile=function(e){console.log("updateTile(): enter"),console.log(e);var t=this.getTileEl(e.pos);if(console.log(t),null==t)throw"Got tile update, but was unable to retrieve corresponding DOM element.";for(var o=0,n=Array.prototype.slice.call(t.classList);o<n.length;o++){var a=n[o];a.match(/^icon-tile_/)&&t.classList.remove(a)}switch(e.state){case"HIDDEN":t.classList.add("icon-tile_back");break;case"VISIBLE":t.classList.add("icon-tile_"+e.type.toLowerCase());break;default:console.log("unexpected tile state!")}},e.prototype.onUpdateActionButtons=function(e,t){var o,n=this;if(this.isCurrentPlayerActive())switch(e){case"stCharacterSelection":1<=t.currentPlayerCharacterCount&&2<=t.characterCount&&this.addActionButton("bPass",_("Pass"),function(){return n.ajaxcallwrapper("actPass")});break;case"stPlayerTurn":null!==this.selectedTile&&(o=this.encodePos(this.selectedTile),this.addActionButton("bMove",_("Move"),function(){return n.ajaxcallwrapper("actMove",{pos:o})}),this.addActionButton("bPeek",_("Peek"),function(){return n.ajaxcallwrapper("actPeek",{pos:o})}))}},e.prototype.selectTile=function(e){var t;null!==this.selectedTile&&(t=this.getTileEl(this.selectedTile),console.log("got previously-selected tile el: ",t),t.classList.remove("tile-selected")),this.selectedTile=e,null!==this.selectedTile&&(t=this.getTileEl(this.selectedTile),console.log("got newly-selected tile el: ",t),t.classList.add("tile-selected")),this.triggerUpdateActionButtons()},e.prototype.encodePos=function(e){return e[0]+","+e[1]+","+e[2]},e.prototype.handleTileClick=function(e,t){console.log("handleTileClick",e,t);t=t.match(/^(\d+)_(\d+)_(\d+)$/),t=[+t[1],+t[2],+t[3]];"stPlayerTurn"===this.gamedatas.gamestate.name?(console.log("handleTileClick on player turn: "+t),this.selectTile(t)):(this.ajaxcall("/burglebrostwo/burglebrostwo/actSelectTile.html",{pos:this.encodePos(t)},this,function(){},console.error),console.log("  handleTileClick -> ajaxcall dispatched"),dojo.stopEvent(e))},e.prototype.resetUi=function(){dojo.query(".tile").removeClass("tile-selectable")},e.prototype.getTileEl=function(e){return $("tile_"+e[0]+"_"+e[1]+"_"+e[2])},e.prototype.getTileContainerEl=function(e){return $("tile_"+e[0]+"_"+e[1]+"_"+e[2]+"_container")},e.prototype.getTileTokensEl=function(e){return $("tile_"+e[0]+"_"+e[1]+"_"+e[2]+"_tokens")},e.prototype.getEntityEl=function(e){return $(this.getEntityElId(e))},e.prototype.getEntityElId=function(e){return isEntity(e)?"entity_"+e.id:"entity_"+e},e.prototype.setElVisibility=function(e,t){t?e.classList.remove("hidden"):e.classList.add("hidden")},e.prototype.isPlayerHandVisibleInState=function(e){return"stCharacterSelection"===e},e.prototype.areCharacterHandsVisibleInState=function(e){return!0},e.prototype.onEnteringState=function(e,t){r.prototype.onEnteringState.call(this,e,t);var a=this;switch(console.log("onEnteringState(): "+e),console.log(t),this.resetUi(),this.panelManager.onEnteringState(e,t),this.setElVisibility($("player_hand_wrap_1"),this.isPlayerHandVisibleInState(e)),this.setElVisibility($("character_hands_wrap"),this.areCharacterHandsVisibleInState(e)),e){case"stCharacterSelection":console.log("onEnteringState(): [stCharacterSelection]"),t.args.cards.forEach(function(e,t){var o=e.cardImage,n=a.getCardUniqueId(o[0],o[1]);a.playerHand.addToStockWithId(n,e.id),console.log("adding card to hand: cardImage="+o+" cardTypeUid="+n)});break;case"stPlaceEntranceTokens":case"stPlayerTurnEnterMap":for(var o=0,n=t.args.selectableTiles;o<n.length;o++){var i=n[o];this.getTileEl(i).classList.add("tile-selectable")}}},e.prototype.onLeavingState=function(e){r.prototype.onLeavingState.call(this,e)},e.prototype.onButtonClick=function(e){console.log("onButtonClick",e)},e.prototype.setupNotifications=function(){for(var e in console.log("**setup notif**"),this)"function"==typeof this[e]&&e.startsWith("notif_")&&dojo.subscribe(e.substring(6),this,e)},e.prototype.onBgaEvent=function(e,t){console.log("*** BGA event: "+e),console.log(t)},e.prototype.notif_characterSelected=function(e){console.log("-*- notif: characterSelected"),console.log(e),this.playerHand.removeFromStockById(e.args.cardId);e=e.args.character;this.playerCharacter[e.id]=new PlayerCharacterView(this,e),this.characterPanel[e.id]=new CharacterPanelView(this,e)},e.prototype.notif_wallSpawns=function(e){this.createWall(e.args.wall)},e.prototype.notif_entitySpawns=function(e){this.createEntity(e.args.entity)},e.prototype.notif_entityUpdates=function(e){this.updateEntity(e.args.entity)},e.prototype.notif_entityDespawns=function(e){this.despawnEntity(e.args.entityId)},e.prototype.notif_tileUpdates=function(e){this.updateTile(e.args.tile)},e}(GameBasics),PanelManager=function(){function e(e,t){this.gameBody=e,this.tablewidePanelEl=dojo.place(e.format_block("jstpl_tablewide_panel",{}),$("player_boards"),"first"),this.tableTokenZone=new ebg.zone,this.tableTokenZone.create(e,"tablewide_panel_tokens",24,24),this.tableTokenZone.setPattern("grid"),dojo.connect($("stepping-toggle"),"change",this,"onChangeSteppingToggle"),$("stepping-toggle").checked=t.gameFlowSettings.stepping}return e.prototype.onEnteringState=function(e,t){e},e.prototype.onChangeSteppingToggle=function(){var e=$("stepping-toggle").checked;this.gameBody.ajaxcallwrapper("actChangeGameFlowSettings",{stepping:e})},e}(),PlayerCharacterView=function(){function e(e,t){dojo.place(e.format_block("jstpl_character_hand",{pcId:t.id,characterName:t.characterName,playerName:t.playerName}),"character_hands_wrap"),this.handStock=e.createHandStock($("character_hand_cards_"+t.id),"handleCardSelected"),this.update(e,t)}return e.prototype.update=function(e,t){for(var o=0,n=(this.pc=t).hand;o<n.length;o++){var a=n[o],i=a.cardImage,r=e.getCardUniqueId(i[0],i[1]);this.handStock.addToStockWithId(r,""+a.id),console.log("adding card to character hand: cardImage="+i+" cardTypeUid="+r)}},e.prototype.handleCardSelected=function(e,t){},e}(),StaticData=function(){function e(){}return e.cardsPerRow=9,e.cardImageIds={bros:{acrobat:0,back:1,hacker:9,hawk:10,juicer:2,peterman:11,raven:18,rigger:19,rook:20,spotter:3},deaddrops:{0:12,1:21,2:27,3:28,4:29,5:30,6:4,7:13,back:22},gear:{adrenaline:31,"air-ducts":36,"all-in":37,"altered-id-badge":38,"back_give-action":39,"back_make-commotion":40,"back_take-heat":5,bingo:14,"bird-tricks":23,"body-double":32,clairvoyant:41,crybaby:45,"double-flip":46,earpiece:47,"face-masks":48,fainting:49,"fake-mustache":50,"folding-ladder":6,"fowl-play":15,"free-bird":24,"get-cracking":33,"good-intel":42,"grappling-hook":51,hack:54,impersonate:55,"improvised-route":56,"loop-footage":57,macgyver:58,"mind-tricks":59,mirage:60,"out-of-order":7,"radio-interference":16,scaffolding:25,sledgehammer:34,"sliding-door":43,"special-offer":52,"stacked-deck":61,telekinesis:63,zipline:64},lounge:{back:65,chatterbox:66,directions:67,"dubious-meeting":68,"espresso-bar":69,"happy-hour":70,"share-a-drink":8,thirsty:17,tipsy:26},patrol:{back:35},pool:{back:44,cannonball:53,"go-for-a-swim":62,"identity-theft":71,"lifeguard-tip":72,"no-running":73,"pool-prank":74,"splash-zone":75,"trade-shifts":76}},e}();