<?php $this->pageTitle=Yii::app()->name; ?>

<form class="settings_form" method="post">

	<h4><?php echo $language['profile_settings']; ?></h4>
	<div class="row">
		<label for="first_name"><?php echo $language['first_name']; ?>:</label>
		<input type="text" id="first_name" name="first_name" value="<?php echo $profile['first_name']; ?>">
	</div>
	<div class="row">
		<label for="last_name"><?php echo $language['last_name']; ?>:</label>
		<input type="text" id="last_name" name="last_name" value="<?php echo $profile['last_name']; ?>">
	</div>
	<div class="row">
		<label for="nickname"><?php echo $language['nickname']; ?>:</label>
		<input type="text" id="nickname" name="nickname" value="<?php echo $profile['nickname']; ?>">
	</div>	
	<div class="row">
		<label for="primary_discipline"><?php echo $language['primary_discipline']; ?>: </label>
		<select id="primary_discipline" name="primary_discipline">
			<option value=""><?php echo $language['please_select_discipline']; ?></option>
			<option value="100m"<?php echo $profile['disciplines'][1]=='100m'? ' selected': ''?>><?php echo $language['100m']; ?></option>
			<option value="200m"<?php echo $profile['disciplines'][1]=='200m'? ' selected': ''?>><?php echo $language['200m']; ?></option>
			<option value="400m"<?php echo $profile['disciplines'][1]=='400m'? ' selected': ''?>><?php echo $language['400m']; ?></option>
			<option value="800m"<?php echo $profile['disciplines'][1]=='800m'? ' selected': ''?>><?php echo $language['800m']; ?></option>
			<option value="1500m"<?php echo $profile['disciplines'][1]=='1500m'? ' selected': ''?>><?php echo $language['1500m']; ?></option>
			<option value="3000m"<?php echo $profile['disciplines'][1]=='3000m'? ' selected': ''?>><?php echo $language['3000m']; ?></option>
			<option value="60m_hurdles"<?php echo $profile['disciplines'][1]=='60m_hurdles'? ' selected': ''?>><?php echo $language['60m_hurdles']; ?></option>
			<option value="100m_hurdles"<?php echo $profile['disciplines'][1]=='100m_hurdles'? ' selected': ''?>><?php echo $language['100m_hurdles']; ?></option>
			<option value="110m_hurdles"<?php echo $profile['disciplines'][1]=='110m_hurdles'? ' selected': ''?>><?php echo $language['110m_hurdles']; ?></option>
			<option value="400m_hurdles"<?php echo $profile['disciplines'][1]=='400m_hurdles'? ' selected': ''?>><?php echo $language['400m_hurdles']; ?></option>
			<option value="3000m_steeple"<?php echo $profile['disciplines'][1]=='3000m_steeple'? ' selected': ''?>><?php echo $language['3000m_steeple']; ?></option>
			<option value="4x100m_relay"<?php echo $profile['disciplines'][1]=='4x100m_relay'? ' selected': ''?>><?php echo $language['4x100m_relay']; ?></option>
			<option value="4x400m_relay"<?php echo $profile['disciplines'][1]=='4x400m_relay'? ' selected': ''?>><?php echo $language['4x400m_relay']; ?></option>
			<option value="high_jump"<?php echo $profile['disciplines'][1]=='high_jump'? ' selected': ''?>><?php echo $language['high_jump']; ?></option>
			<option value="long_jump"<?php echo $profile['disciplines'][1]=='long_jump'? ' selected': ''?>><?php echo $language['long_jump']; ?></option>
			<option value="triple_jump"<?php echo $profile['disciplines'][1]=='triple_jump'? ' selected': ''?>><?php echo $language['triple_jump']; ?></option>
			<option value="pole_vault"<?php echo $profile['disciplines'][1]=='pole_vault'? ' selected': ''?>><?php echo $language['pole_vault']; ?></option>
			<option value="shot_put"<?php echo $profile['disciplines'][1]=='shot_put'? ' selected': ''?>><?php echo $language['shot_put']; ?></option>
			<option value="discus"<?php echo $profile['disciplines'][1]=='discus'? ' selected': ''?>><?php echo $language['discus']; ?></option>
			<option value="hammer"<?php echo $profile['disciplines'][1]=='hammer'? ' selected': ''?>><?php echo $language['hammer']; ?></option>
			<option value="javelin"<?php echo $profile['disciplines'][1]=='javelin'? ' selected': ''?>><?php echo $language['javelin']; ?></option>
			<option value="pentathlon"<?php echo $profile['disciplines'][1]=='pentathlon'? ' selected': ''?>><?php echo $language['pentathlon']; ?></option>
			<option value="heptathlon"<?php echo $profile['disciplines'][1]=='heptathlon'? ' selected': ''?>><?php echo $language['heptathlon']; ?></option>
			<option value="decathlon"<?php echo $profile['disciplines'][1]=='decathlon'? ' selected': ''?>><?php echo $language['decathlon']; ?></option>
		</select>
	</div>
	<div class="row">
		<label for="secondary_discipline"><?php echo $language['secondary_discipline']; ?>: </label>
		<select id="secondary_discipline" name="secondary_discipline">
			<option value=""><?php echo $language['please_select_discipline']; ?></option>
			<option value="100m"<?php echo $profile['disciplines'][2]=='100m'? ' selected': ''?>><?php echo $language['100m']; ?></option>
			<option value="200m"<?php echo $profile['disciplines'][2]=='200m'? ' selected': ''?>><?php echo $language['200m']; ?></option>
			<option value="400m"<?php echo $profile['disciplines'][2]=='400m'? ' selected': ''?>><?php echo $language['400m']; ?></option>
			<option value="800m"<?php echo $profile['disciplines'][2]=='800m'? ' selected': ''?>><?php echo $language['800m']; ?></option>
			<option value="1500m"<?php echo $profile['disciplines'][2]=='1500m'? ' selected': ''?>><?php echo $language['1500m']; ?></option>
			<option value="3000m"<?php echo $profile['disciplines'][2]=='3000m'? ' selected': ''?>><?php echo $language['3000m']; ?></option>
			<option value="60m_hurdles"<?php echo $profile['disciplines'][2]=='60m_hurdles'? ' selected': ''?>><?php echo $language['60m_hurdles']; ?></option>
			<option value="100m_hurdles"<?php echo $profile['disciplines'][2]=='100m_hurdles'? ' selected': ''?>><?php echo $language['100m_hurdles']; ?></option>
			<option value="110m_hurdles"<?php echo $profile['disciplines'][2]=='110m_hurdles'? ' selected': ''?>><?php echo $language['110m_hurdles']; ?></option>
			<option value="400m_hurdles"<?php echo $profile['disciplines'][2]=='400m_hurdles'? ' selected': ''?>><?php echo $language['400m_hurdles']; ?></option>
			<option value="3000m_steeple"<?php echo $profile['disciplines'][2]=='3000m_steeple'? ' selected': ''?>><?php echo $language['3000m_steeple']; ?></option>
			<option value="4x100m_relay"<?php echo $profile['disciplines'][2]=='4x100m_relay'? ' selected': ''?>><?php echo $language['4x100m_relay']; ?></option>
			<option value="4x400m_relay"<?php echo $profile['disciplines'][2]=='4x400m_relay'? ' selected': ''?>><?php echo $language['4x400m_relay']; ?></option>
			<option value="high_jump"<?php echo $profile['disciplines'][2]=='high_jump'? ' selected': ''?>><?php echo $language['high_jump']; ?></option>
			<option value="long_jump"<?php echo $profile['disciplines'][2]=='long_jump'? ' selected': ''?>><?php echo $language['long_jump']; ?></option>
			<option value="triple_jump"<?php echo $profile['disciplines'][2]=='triple_jump'? ' selected': ''?>><?php echo $language['triple_jump']; ?></option>
			<option value="pole_vault"<?php echo $profile['disciplines'][2]=='pole_vault'? ' selected': ''?>><?php echo $language['pole_vault']; ?></option>
			<option value="shot_put"<?php echo $profile['disciplines'][2]=='shot_put'? ' selected': ''?>><?php echo $language['shot_put']; ?></option>
			<option value="discus"<?php echo $profile['disciplines'][2]=='discus'? ' selected': ''?>><?php echo $language['discus']; ?></option>
			<option value="hammer"<?php echo $profile['disciplines'][2]=='hammer'? ' selected': ''?>><?php echo $language['hammer']; ?></option>
			<option value="javelin"<?php echo $profile['disciplines'][2]=='javelin'? ' selected': ''?>><?php echo $language['javelin']; ?></option>
			<option value="pentathlon"<?php echo $profile['disciplines'][2]=='pentathlon'? ' selected': ''?>><?php echo $language['pentathlon']; ?></option>
			<option value="heptathlon"<?php echo $profile['disciplines'][2]=='heptathlon'? ' selected': ''?>><?php echo $language['heptathlon']; ?></option>
			<option value="decathlon"<?php echo $profile['disciplines'][2]=='decathlon'? ' selected': ''?>><?php echo $language['decathlon']; ?></option>
		</select>
	</div>
	<div class="row">
		<label for="country"><?php echo $language['country']; ?>:</label>
		<select id="country" name="country">
			<option value=""><?php echo $language['please_select_country']; ?></option>
			<option value="af"<?php echo $profile['country']=='af'? ' selected': ''; ?>><?php echo $language['af']; ?></option>
			<option value="ax"<?php echo $profile['country']=='ax'? ' selected': ''; ?>><?php echo $language['ax']; ?></option>
			<option value="al"<?php echo $profile['country']=='al'? ' selected': ''; ?>><?php echo $language['al']; ?></option>
			<option value="dz"<?php echo $profile['country']=='dz'? ' selected': ''; ?>><?php echo $language['dz']; ?></option>
			<option value="as"<?php echo $profile['country']=='as'? ' selected': ''; ?>><?php echo $language['as']; ?></option>
			<option value="ad"<?php echo $profile['country']=='ad'? ' selected': ''; ?>><?php echo $language['ad']; ?></option>
			<option value="ao"<?php echo $profile['country']=='ao'? ' selected': ''; ?>><?php echo $language['ao']; ?></option>
			<option value="ai"<?php echo $profile['country']=='ai'? ' selected': ''; ?>><?php echo $language['ai']; ?></option>
			<option value="aq"<?php echo $profile['country']=='aq'? ' selected': ''; ?>><?php echo $language['aq']; ?></option>
			<option value="ag"<?php echo $profile['country']=='ag'? ' selected': ''; ?>><?php echo $language['ag']; ?></option>
			<option value="ar"<?php echo $profile['country']=='ar'? ' selected': ''; ?>><?php echo $language['ar']; ?></option>
			<option value="am"<?php echo $profile['country']=='am'? ' selected': ''; ?>><?php echo $language['am']; ?></option>
			<option value="aw"<?php echo $profile['country']=='aw'? ' selected': ''; ?>><?php echo $language['aw']; ?></option>
			<option value="au"<?php echo $profile['country']=='au'? ' selected': ''; ?>><?php echo $language['au']; ?></option>
			<option value="at"<?php echo $profile['country']=='at'? ' selected': ''; ?>><?php echo $language['at']; ?></option>
			<option value="az"<?php echo $profile['country']=='az'? ' selected': ''; ?>><?php echo $language['az']; ?></option>
			<option value="bs"<?php echo $profile['country']=='bs'? ' selected': ''; ?>><?php echo $language['bs']; ?></option>
			<option value="bh"<?php echo $profile['country']=='bh'? ' selected': ''; ?>><?php echo $language['bh']; ?></option>
			<option value="bd"<?php echo $profile['country']=='bd'? ' selected': ''; ?>><?php echo $language['bd']; ?></option>
			<option value="bb"<?php echo $profile['country']=='bb'? ' selected': ''; ?>><?php echo $language['bb']; ?></option>
			<option value="by"<?php echo $profile['country']=='by'? ' selected': ''; ?>><?php echo $language['by']; ?></option>
			<option value="be"<?php echo $profile['country']=='be'? ' selected': ''; ?>><?php echo $language['be']; ?></option>
			<option value="bz"<?php echo $profile['country']=='bz'? ' selected': ''; ?>><?php echo $language['bz']; ?></option>
			<option value="bj"<?php echo $profile['country']=='bj'? ' selected': ''; ?>><?php echo $language['bj']; ?></option>
			<option value="bm"<?php echo $profile['country']=='bm'? ' selected': ''; ?>><?php echo $language['bm']; ?></option>
			<option value="bt"<?php echo $profile['country']=='bt'? ' selected': ''; ?>><?php echo $language['bt']; ?></option>
			<option value="bo"<?php echo $profile['country']=='bo'? ' selected': ''; ?>><?php echo $language['bo']; ?></option>
			<option value="bq"<?php echo $profile['country']=='bq'? ' selected': ''; ?>><?php echo $language['bq']; ?></option>
			<option value="ba"<?php echo $profile['country']=='ba'? ' selected': ''; ?>><?php echo $language['ba']; ?></option>
			<option value="bw"<?php echo $profile['country']=='bw'? ' selected': ''; ?>><?php echo $language['bw']; ?></option>
			<option value="bv"<?php echo $profile['country']=='bv'? ' selected': ''; ?>><?php echo $language['bv']; ?></option>
			<option value="br"<?php echo $profile['country']=='br'? ' selected': ''; ?>><?php echo $language['br']; ?></option>
			<option value="io"<?php echo $profile['country']=='io'? ' selected': ''; ?>><?php echo $language['io']; ?></option>
			<option value="bn"<?php echo $profile['country']=='bn'? ' selected': ''; ?>><?php echo $language['bn']; ?></option>
			<option value="bg"<?php echo $profile['country']=='bg'? ' selected': ''; ?>><?php echo $language['bg']; ?></option>
			<option value="bf"<?php echo $profile['country']=='bf'? ' selected': ''; ?>><?php echo $language['bf']; ?></option>
			<option value="bi"<?php echo $profile['country']=='bi'? ' selected': ''; ?>><?php echo $language['bi']; ?></option>
			<option value="kh"<?php echo $profile['country']=='kh'? ' selected': ''; ?>><?php echo $language['kh']; ?></option>
			<option value="cm"<?php echo $profile['country']=='cm'? ' selected': ''; ?>><?php echo $language['cm']; ?></option>
			<option value="ca"<?php echo $profile['country']=='ca'? ' selected': ''; ?>><?php echo $language['ca']; ?></option>
			<option value="cv"<?php echo $profile['country']=='cv'? ' selected': ''; ?>><?php echo $language['cv']; ?></option>
			<option value="ky"<?php echo $profile['country']=='ky'? ' selected': ''; ?>><?php echo $language['ky']; ?></option>
			<option value="cf"<?php echo $profile['country']=='cf'? ' selected': ''; ?>><?php echo $language['cf']; ?></option>
			<option value="td"<?php echo $profile['country']=='td'? ' selected': ''; ?>><?php echo $language['td']; ?></option>
			<option value="cl"<?php echo $profile['country']=='cl'? ' selected': ''; ?>><?php echo $language['cl']; ?></option>
			<option value="cn"<?php echo $profile['country']=='cn'? ' selected': ''; ?>><?php echo $language['cn']; ?></option>
			<option value="cx"<?php echo $profile['country']=='cx'? ' selected': ''; ?>><?php echo $language['cx']; ?></option>
			<option value="cc"<?php echo $profile['country']=='cc'? ' selected': ''; ?>><?php echo $language['cc']; ?></option>
			<option value="co"<?php echo $profile['country']=='co'? ' selected': ''; ?>><?php echo $language['co']; ?></option>
			<option value="km"<?php echo $profile['country']=='km'? ' selected': ''; ?>><?php echo $language['km']; ?></option>
			<option value="cg"<?php echo $profile['country']=='cg'? ' selected': ''; ?>><?php echo $language['cg']; ?></option>
			<option value="cd"<?php echo $profile['country']=='cd'? ' selected': ''; ?>><?php echo $language['cd']; ?></option>
			<option value="ck"<?php echo $profile['country']=='ck'? ' selected': ''; ?>><?php echo $language['ck']; ?></option>
			<option value="cr"<?php echo $profile['country']=='cr'? ' selected': ''; ?>><?php echo $language['cr']; ?></option>
			<option value="ci"<?php echo $profile['country']=='ci'? ' selected': ''; ?>><?php echo $language['ci']; ?></option>
			<option value="hr"<?php echo $profile['country']=='hr'? ' selected': ''; ?>><?php echo $language['hr']; ?></option>
			<option value="cu"<?php echo $profile['country']=='cu'? ' selected': ''; ?>><?php echo $language['cu']; ?></option>
			<option value="cw"<?php echo $profile['country']=='cw'? ' selected': ''; ?>><?php echo $language['cw']; ?></option>
			<option value="cy"<?php echo $profile['country']=='cy'? ' selected': ''; ?>><?php echo $language['cy']; ?></option>
			<option value="cz"<?php echo $profile['country']=='cz'? ' selected': ''; ?>><?php echo $language['cz']; ?></option>
			<option value="dk"<?php echo $profile['country']=='dk'? ' selected': ''; ?>><?php echo $language['dk']; ?></option>
			<option value="dj"<?php echo $profile['country']=='dj'? ' selected': ''; ?>><?php echo $language['dj']; ?></option>
			<option value="dm"<?php echo $profile['country']=='dm'? ' selected': ''; ?>><?php echo $language['dm']; ?></option>
			<option value="do"<?php echo $profile['country']=='do'? ' selected': ''; ?>><?php echo $language['do']; ?></option>
			<option value="ec"<?php echo $profile['country']=='ec'? ' selected': ''; ?>><?php echo $language['ec']; ?></option>
			<option value="eg"<?php echo $profile['country']=='eg'? ' selected': ''; ?>><?php echo $language['eg']; ?></option>
			<option value="sv"<?php echo $profile['country']=='sv'? ' selected': ''; ?>><?php echo $language['sv']; ?></option>
			<option value="gq"<?php echo $profile['country']=='gq'? ' selected': ''; ?>><?php echo $language['gq']; ?></option>
			<option value="er"<?php echo $profile['country']=='er'? ' selected': ''; ?>><?php echo $language['er']; ?></option>
			<option value="ee"<?php echo $profile['country']=='ee'? ' selected': ''; ?>><?php echo $language['ee']; ?></option>
			<option value="et"<?php echo $profile['country']=='et'? ' selected': ''; ?>><?php echo $language['et']; ?></option>
			<option value="fk"<?php echo $profile['country']=='fk'? ' selected': ''; ?>><?php echo $language['fk']; ?></option>
			<option value="fo"<?php echo $profile['country']=='fo'? ' selected': ''; ?>><?php echo $language['fo']; ?></option>
			<option value="fj"<?php echo $profile['country']=='fj'? ' selected': ''; ?>><?php echo $language['fj']; ?></option>
			<option value="fi"<?php echo $profile['country']=='fi'? ' selected': ''; ?>><?php echo $language['fi']; ?></option>
			<option value="fr"<?php echo $profile['country']=='fr'? ' selected': ''; ?>><?php echo $language['fr']; ?></option>
			<option value="gf"<?php echo $profile['country']=='gf'? ' selected': ''; ?>><?php echo $language['gf']; ?></option>
			<option value="pf"<?php echo $profile['country']=='pf'? ' selected': ''; ?>><?php echo $language['pf']; ?></option>
			<option value="tf"<?php echo $profile['country']=='tf'? ' selected': ''; ?>><?php echo $language['tf']; ?></option>
			<option value="ga"<?php echo $profile['country']=='ga'? ' selected': ''; ?>><?php echo $language['ga']; ?></option>
			<option value="gm"<?php echo $profile['country']=='gm'? ' selected': ''; ?>><?php echo $language['gm']; ?></option>
			<option value="ge"<?php echo $profile['country']=='ge'? ' selected': ''; ?>><?php echo $language['ge']; ?></option>
			<option value="de"<?php echo $profile['country']=='de'? ' selected': ''; ?>><?php echo $language['de']; ?></option>
			<option value="gh"<?php echo $profile['country']=='gh'? ' selected': ''; ?>><?php echo $language['gh']; ?></option>
			<option value="gi"<?php echo $profile['country']=='gi'? ' selected': ''; ?>><?php echo $language['gi']; ?></option>
			<option value="gr"<?php echo $profile['country']=='gr'? ' selected': ''; ?>><?php echo $language['gr']; ?></option>
			<option value="gl"<?php echo $profile['country']=='gl'? ' selected': ''; ?>><?php echo $language['gl']; ?></option>
			<option value="gd"<?php echo $profile['country']=='gd'? ' selected': ''; ?>><?php echo $language['gd']; ?></option>
			<option value="gp"<?php echo $profile['country']=='gp'? ' selected': ''; ?>><?php echo $language['gp']; ?></option>
			<option value="gu"<?php echo $profile['country']=='gu'? ' selected': ''; ?>><?php echo $language['gu']; ?></option>
			<option value="gt"<?php echo $profile['country']=='gt'? ' selected': ''; ?>><?php echo $language['gt']; ?></option>
			<option value="gg"<?php echo $profile['country']=='gg'? ' selected': ''; ?>><?php echo $language['gg']; ?></option>
			<option value="gn"<?php echo $profile['country']=='gn'? ' selected': ''; ?>><?php echo $language['gn']; ?></option>
			<option value="gw"<?php echo $profile['country']=='gw'? ' selected': ''; ?>><?php echo $language['gw']; ?></option>
			<option value="gy"<?php echo $profile['country']=='gy'? ' selected': ''; ?>><?php echo $language['gy']; ?></option>
			<option value="ht"<?php echo $profile['country']=='ht'? ' selected': ''; ?>><?php echo $language['ht']; ?></option>
			<option value="hm"<?php echo $profile['country']=='hm'? ' selected': ''; ?>><?php echo $language['hm']; ?></option>
			<option value="va"<?php echo $profile['country']=='va'? ' selected': ''; ?>><?php echo $language['va']; ?></option>
			<option value="hn"<?php echo $profile['country']=='hn'? ' selected': ''; ?>><?php echo $language['hn']; ?></option>
			<option value="hk"<?php echo $profile['country']=='hk'? ' selected': ''; ?>><?php echo $language['hk']; ?></option>
			<option value="hu"<?php echo $profile['country']=='hu'? ' selected': ''; ?>><?php echo $language['hu']; ?></option>
			<option value="is"<?php echo $profile['country']=='is'? ' selected': ''; ?>><?php echo $language['is']; ?></option>
			<option value="in"<?php echo $profile['country']=='in'? ' selected': ''; ?>><?php echo $language['in']; ?></option>
			<option value="id"<?php echo $profile['country']=='id'? ' selected': ''; ?>><?php echo $language['id']; ?></option>
			<option value="ir"<?php echo $profile['country']=='ir'? ' selected': ''; ?>><?php echo $language['ir']; ?></option>
			<option value="iq"<?php echo $profile['country']=='iq'? ' selected': ''; ?>><?php echo $language['iq']; ?></option>
			<option value="ie"<?php echo $profile['country']=='ie'? ' selected': ''; ?>><?php echo $language['ie']; ?></option>
			<option value="im"<?php echo $profile['country']=='im'? ' selected': ''; ?>><?php echo $language['im']; ?></option>
			<option value="il"<?php echo $profile['country']=='il'? ' selected': ''; ?>><?php echo $language['il']; ?></option>
			<option value="it"<?php echo $profile['country']=='it'? ' selected': ''; ?>><?php echo $language['it']; ?></option>
			<option value="jm"<?php echo $profile['country']=='jm'? ' selected': ''; ?>><?php echo $language['jm']; ?></option>
			<option value="jp"<?php echo $profile['country']=='jp'? ' selected': ''; ?>><?php echo $language['jp']; ?></option>
			<option value="je"<?php echo $profile['country']=='je'? ' selected': ''; ?>><?php echo $language['je']; ?></option>
			<option value="jo"<?php echo $profile['country']=='jo'? ' selected': ''; ?>><?php echo $language['jo']; ?></option>
			<option value="kz"<?php echo $profile['country']=='kz'? ' selected': ''; ?>><?php echo $language['kz']; ?></option>
			<option value="ke"<?php echo $profile['country']=='ke'? ' selected': ''; ?>><?php echo $language['ke']; ?></option>
			<option value="ki"<?php echo $profile['country']=='ki'? ' selected': ''; ?>><?php echo $language['ki']; ?></option>
			<option value="kp"<?php echo $profile['country']=='kp'? ' selected': ''; ?>><?php echo $language['kp']; ?></option>
			<option value="kr"<?php echo $profile['country']=='kr'? ' selected': ''; ?>><?php echo $language['kr']; ?></option>
			<option value="kw"<?php echo $profile['country']=='kw'? ' selected': ''; ?>><?php echo $language['kw']; ?></option>
			<option value="kg"<?php echo $profile['country']=='kg'? ' selected': ''; ?>><?php echo $language['kg']; ?></option>
			<option value="la"<?php echo $profile['country']=='la'? ' selected': ''; ?>><?php echo $language['la']; ?></option>
			<option value="lv"<?php echo $profile['country']=='lv'? ' selected': ''; ?>><?php echo $language['lv']; ?></option>
			<option value="lb"<?php echo $profile['country']=='lb'? ' selected': ''; ?>><?php echo $language['lb']; ?></option>
			<option value="ls"<?php echo $profile['country']=='ls'? ' selected': ''; ?>><?php echo $language['ls']; ?></option>
			<option value="lr"<?php echo $profile['country']=='lr'? ' selected': ''; ?>><?php echo $language['lr']; ?></option>
			<option value="ly"<?php echo $profile['country']=='ly'? ' selected': ''; ?>><?php echo $language['ly']; ?></option>
			<option value="li"<?php echo $profile['country']=='li'? ' selected': ''; ?>><?php echo $language['li']; ?></option>
			<option value="lt"<?php echo $profile['country']=='lt'? ' selected': ''; ?>><?php echo $language['lt']; ?></option>
			<option value="lu"<?php echo $profile['country']=='lu'? ' selected': ''; ?>><?php echo $language['lu']; ?></option>
			<option value="mo"<?php echo $profile['country']=='mo'? ' selected': ''; ?>><?php echo $language['mo']; ?></option>
			<option value="mk"<?php echo $profile['country']=='mk'? ' selected': ''; ?>><?php echo $language['mk']; ?></option>
			<option value="mg"<?php echo $profile['country']=='mg'? ' selected': ''; ?>><?php echo $language['mg']; ?></option>
			<option value="mw"<?php echo $profile['country']=='mw'? ' selected': ''; ?>><?php echo $language['mw']; ?></option>
			<option value="my"<?php echo $profile['country']=='my'? ' selected': ''; ?>><?php echo $language['my']; ?></option>
			<option value="mv"<?php echo $profile['country']=='mv'? ' selected': ''; ?>><?php echo $language['mv']; ?></option>
			<option value="ml"<?php echo $profile['country']=='ml'? ' selected': ''; ?>><?php echo $language['ml']; ?></option>
			<option value="mt"<?php echo $profile['country']=='mt'? ' selected': ''; ?>><?php echo $language['mt']; ?></option>
			<option value="mh"<?php echo $profile['country']=='mh'? ' selected': ''; ?>><?php echo $language['mh']; ?></option>
			<option value="mq"<?php echo $profile['country']=='mq'? ' selected': ''; ?>><?php echo $language['mq']; ?></option>
			<option value="mr"<?php echo $profile['country']=='mr'? ' selected': ''; ?>><?php echo $language['mr']; ?></option>
			<option value="mu"<?php echo $profile['country']=='mu'? ' selected': ''; ?>><?php echo $language['mu']; ?></option>
			<option value="yt"<?php echo $profile['country']=='yt'? ' selected': ''; ?>><?php echo $language['yt']; ?></option>
			<option value="mx"<?php echo $profile['country']=='mx'? ' selected': ''; ?>><?php echo $language['mx']; ?></option>
			<option value="fm"<?php echo $profile['country']=='fm'? ' selected': ''; ?>><?php echo $language['fm']; ?></option>
			<option value="md"<?php echo $profile['country']=='md'? ' selected': ''; ?>><?php echo $language['md']; ?></option>
			<option value="mc"<?php echo $profile['country']=='mc'? ' selected': ''; ?>><?php echo $language['mc']; ?></option>
			<option value="mn"<?php echo $profile['country']=='mn'? ' selected': ''; ?>><?php echo $language['mn']; ?></option>
			<option value="me"<?php echo $profile['country']=='me'? ' selected': ''; ?>><?php echo $language['me']; ?></option>
			<option value="ms"<?php echo $profile['country']=='ms'? ' selected': ''; ?>><?php echo $language['ms']; ?></option>
			<option value="ma"<?php echo $profile['country']=='ma'? ' selected': ''; ?>><?php echo $language['ma']; ?></option>
			<option value="mz"<?php echo $profile['country']=='mz'? ' selected': ''; ?>><?php echo $language['mz']; ?></option>
			<option value="mm"<?php echo $profile['country']=='mm'? ' selected': ''; ?>><?php echo $language['mm']; ?></option>
			<option value="na"<?php echo $profile['country']=='na'? ' selected': ''; ?>><?php echo $language['na']; ?></option>
			<option value="nr"<?php echo $profile['country']=='nr'? ' selected': ''; ?>><?php echo $language['nr']; ?></option>
			<option value="np"<?php echo $profile['country']=='np'? ' selected': ''; ?>><?php echo $language['np']; ?></option>
			<option value="nl"<?php echo $profile['country']=='nl'? ' selected': ''; ?>><?php echo $language['nl']; ?></option>
			<option value="nc"<?php echo $profile['country']=='nc'? ' selected': ''; ?>><?php echo $language['nc']; ?></option>
			<option value="nz"<?php echo $profile['country']=='nz'? ' selected': ''; ?>><?php echo $language['nz']; ?></option>
			<option value="ni"<?php echo $profile['country']=='ni'? ' selected': ''; ?>><?php echo $language['ni']; ?></option>
			<option value="ne"<?php echo $profile['country']=='ne'? ' selected': ''; ?>><?php echo $language['ne']; ?></option>
			<option value="ng"<?php echo $profile['country']=='ng'? ' selected': ''; ?>><?php echo $language['ng']; ?></option>
			<option value="nu"<?php echo $profile['country']=='nu'? ' selected': ''; ?>><?php echo $language['nu']; ?></option>
			<option value="nf"<?php echo $profile['country']=='nf'? ' selected': ''; ?>><?php echo $language['nf']; ?></option>
			<option value="mp"<?php echo $profile['country']=='mp'? ' selected': ''; ?>><?php echo $language['mp']; ?></option>
			<option value="no"<?php echo $profile['country']=='no'? ' selected': ''; ?>><?php echo $language['no']; ?></option>
			<option value="om"<?php echo $profile['country']=='om'? ' selected': ''; ?>><?php echo $language['om']; ?></option>
			<option value="pk"<?php echo $profile['country']=='pk'? ' selected': ''; ?>><?php echo $language['pk']; ?></option>
			<option value="pw"<?php echo $profile['country']=='pw'? ' selected': ''; ?>><?php echo $language['pw']; ?></option>
			<option value="ps"<?php echo $profile['country']=='ps'? ' selected': ''; ?>><?php echo $language['ps']; ?></option>
			<option value="pa"<?php echo $profile['country']=='pa'? ' selected': ''; ?>><?php echo $language['pa']; ?></option>
			<option value="pg"<?php echo $profile['country']=='pg'? ' selected': ''; ?>><?php echo $language['pg']; ?></option>
			<option value="py"<?php echo $profile['country']=='py'? ' selected': ''; ?>><?php echo $language['py']; ?></option>
			<option value="pe"<?php echo $profile['country']=='pe'? ' selected': ''; ?>><?php echo $language['pe']; ?></option>
			<option value="ph"<?php echo $profile['country']=='ph'? ' selected': ''; ?>><?php echo $language['ph']; ?></option>
			<option value="pn"<?php echo $profile['country']=='pn'? ' selected': ''; ?>><?php echo $language['pn']; ?></option>
			<option value="pl"<?php echo $profile['country']=='pl'? ' selected': ''; ?>><?php echo $language['pl']; ?></option>
			<option value="pt"<?php echo $profile['country']=='pt'? ' selected': ''; ?>><?php echo $language['pt']; ?></option>
			<option value="pr"<?php echo $profile['country']=='pr'? ' selected': ''; ?>><?php echo $language['pr']; ?></option>
			<option value="qa"<?php echo $profile['country']=='qa'? ' selected': ''; ?>><?php echo $language['qa']; ?></option>
			<option value="re"<?php echo $profile['country']=='re'? ' selected': ''; ?>><?php echo $language['re']; ?></option>
			<option value="ro"<?php echo $profile['country']=='ro'? ' selected': ''; ?>><?php echo $language['ro']; ?></option>
			<option value="ru"<?php echo $profile['country']=='ru'? ' selected': ''; ?>><?php echo $language['ru']; ?></option>
			<option value="rw"<?php echo $profile['country']=='rw'? ' selected': ''; ?>><?php echo $language['rw']; ?></option>
			<option value="bl"<?php echo $profile['country']=='bl'? ' selected': ''; ?>><?php echo $language['bl']; ?></option>
			<option value="sh"<?php echo $profile['country']=='sh'? ' selected': ''; ?>><?php echo $language['sh']; ?></option>
			<option value="kn"<?php echo $profile['country']=='kn'? ' selected': ''; ?>><?php echo $language['kn']; ?></option>
			<option value="lc"<?php echo $profile['country']=='lc'? ' selected': ''; ?>><?php echo $language['lc']; ?></option>
			<option value="mf"<?php echo $profile['country']=='mf'? ' selected': ''; ?>><?php echo $language['mf']; ?></option>
			<option value="pm"<?php echo $profile['country']=='pm'? ' selected': ''; ?>><?php echo $language['pm']; ?></option>
			<option value="vc"<?php echo $profile['country']=='vc'? ' selected': ''; ?>><?php echo $language['vc']; ?></option>
			<option value="ws"<?php echo $profile['country']=='ws'? ' selected': ''; ?>><?php echo $language['ws']; ?></option>
			<option value="sm"<?php echo $profile['country']=='sm'? ' selected': ''; ?>><?php echo $language['sm']; ?></option>
			<option value="st"<?php echo $profile['country']=='st'? ' selected': ''; ?>><?php echo $language['st']; ?></option>
			<option value="sa"<?php echo $profile['country']=='sa'? ' selected': ''; ?>><?php echo $language['sa']; ?></option>
			<option value="sn"<?php echo $profile['country']=='sn'? ' selected': ''; ?>><?php echo $language['sn']; ?></option>
			<option value="rs"<?php echo $profile['country']=='rs'? ' selected': ''; ?>><?php echo $language['rs']; ?></option>
			<option value="sc"<?php echo $profile['country']=='sc'? ' selected': ''; ?>><?php echo $language['sc']; ?></option>
			<option value="sl"<?php echo $profile['country']=='sl'? ' selected': ''; ?>><?php echo $language['sl']; ?></option>
			<option value="sg"<?php echo $profile['country']=='sg'? ' selected': ''; ?>><?php echo $language['sg']; ?></option>
			<option value="sx"<?php echo $profile['country']=='sx'? ' selected': ''; ?>><?php echo $language['sx']; ?></option>
			<option value="sk"<?php echo $profile['country']=='sk'? ' selected': ''; ?>><?php echo $language['sk']; ?></option>
			<option value="si"<?php echo $profile['country']=='si'? ' selected': ''; ?>><?php echo $language['si']; ?></option>
			<option value="sb"<?php echo $profile['country']=='sb'? ' selected': ''; ?>><?php echo $language['sb']; ?></option>
			<option value="so"<?php echo $profile['country']=='so'? ' selected': ''; ?>><?php echo $language['so']; ?></option>
			<option value="za"<?php echo $profile['country']=='za'? ' selected': ''; ?>><?php echo $language['za']; ?></option>
			<option value="gs"<?php echo $profile['country']=='gs'? ' selected': ''; ?>><?php echo $language['gs']; ?></option>
			<option value="ss"<?php echo $profile['country']=='ss'? ' selected': ''; ?>><?php echo $language['ss']; ?></option>
			<option value="es"<?php echo $profile['country']=='es'? ' selected': ''; ?>><?php echo $language['es']; ?></option>
			<option value="lk"<?php echo $profile['country']=='lk'? ' selected': ''; ?>><?php echo $language['lk']; ?></option>
			<option value="sd"<?php echo $profile['country']=='sd'? ' selected': ''; ?>><?php echo $language['sd']; ?></option>
			<option value="sr"<?php echo $profile['country']=='sr'? ' selected': ''; ?>><?php echo $language['sr']; ?></option>
			<option value="sj"<?php echo $profile['country']=='sj'? ' selected': ''; ?>><?php echo $language['sj']; ?></option>
			<option value="sz"<?php echo $profile['country']=='sz'? ' selected': ''; ?>><?php echo $language['sz']; ?></option>
			<option value="se"<?php echo $profile['country']=='se'? ' selected': ''; ?>><?php echo $language['se']; ?></option>
			<option value="ch"<?php echo $profile['country']=='ch'? ' selected': ''; ?>><?php echo $language['ch']; ?></option>
			<option value="sy"<?php echo $profile['country']=='sy'? ' selected': ''; ?>><?php echo $language['sy']; ?></option>
			<option value="tw"<?php echo $profile['country']=='tw'? ' selected': ''; ?>><?php echo $language['tw']; ?></option>
			<option value="tj"<?php echo $profile['country']=='tj'? ' selected': ''; ?>><?php echo $language['tj']; ?></option>
			<option value="tz"<?php echo $profile['country']=='tz'? ' selected': ''; ?>><?php echo $language['tz']; ?></option>
			<option value="th"<?php echo $profile['country']=='th'? ' selected': ''; ?>><?php echo $language['th']; ?></option>
			<option value="tl"<?php echo $profile['country']=='tl'? ' selected': ''; ?>><?php echo $language['tl']; ?></option>
			<option value="tg"<?php echo $profile['country']=='tg'? ' selected': ''; ?>><?php echo $language['tg']; ?></option>
			<option value="tk"<?php echo $profile['country']=='tk'? ' selected': ''; ?>><?php echo $language['tk']; ?></option>
			<option value="to"<?php echo $profile['country']=='to'? ' selected': ''; ?>><?php echo $language['to']; ?></option>
			<option value="tt"<?php echo $profile['country']=='tt'? ' selected': ''; ?>><?php echo $language['tt']; ?></option>
			<option value="tn"<?php echo $profile['country']=='tn'? ' selected': ''; ?>><?php echo $language['tn']; ?></option>
			<option value="tr"<?php echo $profile['country']=='tr'? ' selected': ''; ?>><?php echo $language['tr']; ?></option>
			<option value="tm"<?php echo $profile['country']=='tm'? ' selected': ''; ?>><?php echo $language['tm']; ?></option>
			<option value="tc"<?php echo $profile['country']=='tc'? ' selected': ''; ?>><?php echo $language['tc']; ?></option>
			<option value="tv"<?php echo $profile['country']=='tv'? ' selected': ''; ?>><?php echo $language['tv']; ?></option>
			<option value="ug"<?php echo $profile['country']=='ug'? ' selected': ''; ?>><?php echo $language['ug']; ?></option>
			<option value="ua"<?php echo $profile['country']=='ua'? ' selected': ''; ?>><?php echo $language['ua']; ?></option>
			<option value="ae"<?php echo $profile['country']=='ae'? ' selected': ''; ?>><?php echo $language['ae']; ?></option>
			<option value="gb"<?php echo $profile['country']=='gb'? ' selected': ''; ?>><?php echo $language['gb']; ?></option>
			<option value="us"<?php echo $profile['country']=='us'? ' selected': ''; ?>><?php echo $language['us']; ?></option>
			<option value="um"<?php echo $profile['country']=='um'? ' selected': ''; ?>><?php echo $language['um']; ?></option>
			<option value="uy"<?php echo $profile['country']=='uy'? ' selected': ''; ?>><?php echo $language['uy']; ?></option>
			<option value="uz"<?php echo $profile['country']=='uz'? ' selected': ''; ?>><?php echo $language['uz']; ?></option>
			<option value="vu"<?php echo $profile['country']=='vu'? ' selected': ''; ?>><?php echo $language['vu']; ?></option>
			<option value="ve"<?php echo $profile['country']=='ve'? ' selected': ''; ?>><?php echo $language['ve']; ?></option>
			<option value="vn"<?php echo $profile['country']=='vn'? ' selected': ''; ?>><?php echo $language['vn']; ?></option>
			<option value="vg"<?php echo $profile['country']=='vg'? ' selected': ''; ?>><?php echo $language['vg']; ?></option>
			<option value="vi"<?php echo $profile['country']=='vi'? ' selected': ''; ?>><?php echo $language['vi']; ?></option>
			<option value="wf"<?php echo $profile['country']=='wf'? ' selected': ''; ?>><?php echo $language['wf']; ?></option>
			<option value="eh"<?php echo $profile['country']=='eh'? ' selected': ''; ?>><?php echo $language['eh']; ?></option>
			<option value="zm"<?php echo $profile['country']=='zm'? ' selected': ''; ?>><?php echo $language['zm']; ?></option>
			<option value="zw"<?php echo $profile['country']=='zw'? ' selected': ''; ?>><?php echo $language['zw']; ?></option>
		</select>
	</div>
	<div class="row">
		<label for="major_accomplishments"><?php echo $language['major_accomplishments']; ?>:</label>
		<textarea id="major_accomplishments" name="major_accomplishments" placeholder="<?php echo $language['ie_200m_world_champion']; ?>"><?php echo $profile['major_accomplishments']? $profile['major_accomplishments']: ''; ?></textarea>
	</div>
	
	<div class="row">
		<input type="submit" name="profile_settings" value="<?php echo $language['save']; ?>">
	</div>
</form>

<form class="settings_form" method="post">	
	<div class="row">
	<h4><?php echo $language['general_settings']; ?></h4>
	</div>
	<div class="row">
	<label for="select_language"><?php echo $language['choose_language']; ?>:</label>
	<select name="select_language" id="select_language">
		<option value="eng" <?php echo $user['settings']['language'] == 'eng'? 'selected': ''; ?>>English</option>
		<option value="gre" <?php echo $user['settings']['language'] == 'gre'? 'selected': ''; ?>>Ελληνικά</option>
		<option value="rus" <?php echo $user['settings']['language'] == 'rus'? 'selected': ''; ?>>Русский</option>
	</select>
	</div>
	
	<div class="row">
	<label for="select_unit_system"><?php echo $language['choose_unit_system']; ?>:</label>
	<select name="select_unit_system" id="select_unit_system">
		<option value="metric" <?php echo $user['settings']['unit_system'] == 'metric'? 'selected': ''; ?>><?php echo $language['metric']; ?></option>
		<option value="imperial" <?php echo $user['settings']['unit_system'] == 'imperial'? 'selected': ''; ?>><?php echo $language['imperial']; ?></option>
	</select>
	</div>
	
	<div class="row">
	<label for="select_date_format"><?php echo $language['date_format']; ?>:</label>
	<select name="select_date_format" id="select_date_format">
		<option value="d/m/Y" <?php echo $user['settings']['date_format'] == 'd/m/Y'? 'selected': ''; ?>><?php echo $language['d/m/y']; ?></option>
		<option value="m/d/Y" <?php echo $user['settings']['date_format'] == 'm/d/Y'? 'selected': ''; ?>><?php echo $language['m/d/y']; ?></option>
	</select>
	</div>
	
	<div class="row">
	<input type="submit" name="general_settings" value="<?php echo $language['save']; ?>">
	</div>
</form>

<form class="settings_form" method="post">
	<div class="row">
	<h4><?php echo $language['change_password']; ?></h4>
	</div>
	<div class="row">
	<label for="old_password"><?php echo $language['old_password']; ?>:</label>
	<input type="password" id="old_password" name="old_password">
	</div>
	<div class="row">
	<label for="new_password"><?php echo $language['new_password']; ?>:</label>
	<input type="password" id="new_password" name="password">
	</div>
	<div class="row">
	<label for="repeat_new_password"><?php echo $language['repeat_new_password']; ?>:</label>
	<input type="password" id="repeat_new_password" name="repeat_password">
	</div>
	
	<div class="row">
	<input type="submit" name="password_change" value="<?php echo $language['save']; ?>">
	</div>
</form>