<?php $this->pageTitle=Yii::app()->name; ?>
<div id="profile_container">
	<div id="picture_container">
	
	</div>
	<div id="info_container">
		<div class="info_left">
			<div id="info_user_name" class="row">
				<h4><?php echo $profile['first_name'];?> <?php echo $profile['last_name']; ?></h4>
			</div>
			<div class="profile_data">
				<span>
					<?php echo $profile['disciplines'][1]? $language[$profile['disciplines'][1]]: ''; ?><?php echo $profile['disciplines'][2]? ',&nbsp;'.$language[$profile['disciplines'][2]]:''; ?>
				</span>
			</div>
			<div class="profile_data">
				<span><?php echo $profile['country']?$language[$profile['country']]:''; ?></span>
			</div>
			<div class="profile_data">
				<span><?php echo $profile['major_accomplishments']?$profile['major_accomplishments']:''; ?></span>
			</div>
		</div>
		<div class="info_right">
		</div>
	</div>
</div>
			
<!-- HISTORICAL WRAPPER-->
<div id="historical_wrapper">
	<div class="first">
		<dl id="ticker-1">
			<dt>100m</dt>
			<dd><a href="http://en.wikipedia.org/wiki/Usain_Bolt" target="_blank">Usain Bolt</a> is the first man to hold both the 100 metres and 200 metres world records since fully automatic time measurements became mandatory in 1977.</dd>
			<dt>Olympics</dt>
			<dd>Olympics 1984 Medallists 100m : Carl Lewis	USA 9.99 | Sam Graddy	USA 10.19 | Ben Johnson	CAN 10.22</dd>
		</dl>
	</div>
</div>
<!-- / HISTORICAL -->

<div id="main_content">
<!-- 	add new activity form -->
	<div id="new_activity_form"> 
		<a href="javascript:;" id="toggle_new_activity"><?php echo $language['add_new']; ?></a>
		<form method="post" class="hidden" name="add_activity_form">
		<div class="left_column">
				<div class="row">
					<label for="discipline_input"><?php echo $language['discipline']; ?>: </label>
					<select id="discipline_input" name="discipline">
						<option value="100m"<?php echo $profile['disciplines'][1] == '100m'? ' selected': ''; ?>><?php echo $language['100m']; ?></option>
						<option value="200m"<?php echo $profile['disciplines'][1] == '200m'? ' selected': ''; ?>><?php echo $language['200m']; ?></option>
						<option value="400m"<?php echo $profile['disciplines'][1] == '400m'? ' selected': ''; ?>><?php echo $language['400m']; ?></option>
						<option value="800m"<?php echo $profile['disciplines'][1] == '800m'? ' selected': ''; ?>><?php echo $language['800m']; ?></option>
						<option value="1500m"<?php echo $profile['disciplines'][1] == '1500m'? ' selected': ''; ?>><?php echo $language['1500m']; ?></option>
						<option value="3000m"<?php echo $profile['disciplines'][1] == '3000m'? ' selected': ''; ?>><?php echo $language['3000m']; ?></option>
						<option value="60m_hurdles"<?php echo $profile['disciplines'][1] == '60m_hurdles'? ' selected': ''; ?>><?php echo $language['60m_hurdles']; ?></option>
						<option value="100m_hurdles"<?php echo $profile['disciplines'][1] == '100m_hurdles'? ' selected': ''; ?>><?php echo $language['100m_hurdles']; ?></option>
						<option value="110m_hurdles"<?php echo $profile['disciplines'][1] == '110m_hurdles'? ' selected': ''; ?>><?php echo $language['110m_hurdles']; ?></option>
						<option value="400m_hurdles"<?php echo $profile['disciplines'][1] == '400m_hurdles'? ' selected': ''; ?>><?php echo $language['400m_hurdles']; ?></option>
						<option value="3000m_steeple"<?php echo $profile['disciplines'][1] == '3000m_steeple'? ' selected': ''; ?>><?php echo $language['3000m_steeple']; ?></option>
						<option value="4x100m_relay"<?php echo $profile['disciplines'][1] == '4x100m_relay'? ' selected': ''; ?>><?php echo $language['4x100m_relay']; ?></option>
						<option value="4x400m_relay"<?php echo $profile['disciplines'][1] == '4x400m_relay'? ' selected': ''; ?>><?php echo $language['4x400m_relay']; ?></option>
						<option value="marathon"<?php echo $profile['disciplines'][1] == 'marathon'? ' selected': ''; ?>><?php echo $language['marathon']; ?></option>
						<option value="high_jump"<?php echo $profile['disciplines'][1] == 'high_jump'? ' selected': ''; ?>><?php echo $language['high_jump']; ?></option>
						<option value="long_jump"<?php echo $profile['disciplines'][1] == 'long_jump'? ' selected': ''; ?>><?php echo $language['long_jump']; ?></option>
						<option value="triple_jump"<?php echo $profile['disciplines'][1] == 'triple_jump'? ' selected': ''; ?>><?php echo $language['triple_jump']; ?></option>
						<option value="pole_vault"<?php echo $profile['disciplines'][1] == 'pole_vault'? ' selected': ''; ?>><?php echo $language['pole_vault']; ?></option>
						<option value="shot_put"<?php echo $profile['disciplines'][1] == 'shot_put'? ' selected': ''; ?>><?php echo $language['shot_put']; ?></option>
						<option value="discus"<?php echo $profile['disciplines'][1] == 'discus'? ' selected': ''; ?>><?php echo $language['discus']; ?></option>
						<option value="hammer"<?php echo $profile['disciplines'][1] == 'hammer'? ' selected': ''; ?>><?php echo $language['hammer']; ?></option>
						<option value="javelin"<?php echo $profile['disciplines'][1] == 'javelin'? ' selected': ''; ?>><?php echo $language['javelin']; ?></option>
						<option value="pentathlon"<?php echo $profile['disciplines'][1] == 'pentathlon'? ' selected': ''; ?>><?php echo $language['pentathlon']; ?></option>
						<option value="heptathlon"<?php echo $profile['disciplines'][1] == 'heptathlon'? ' selected': ''; ?>><?php echo $language['heptathlon']; ?></option>
						<option value="decathlon"<?php echo $profile['disciplines'][1] == 'decathlon'? ' selected': ''; ?>><?php echo $language['decathlon']; ?></option>
					</select>
				</div>
	
				<?php if(!isset($profile['disciplines'][1]) || !$profile['disciplines'][1] || in_array($profile['disciplines'][1], array('100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon'))): ?>
					<?php $time_activity_visibility = ''; ?>
					<?php $distance_activity_visibility = ' hidden'; ?>
					<?php $point_activity_visibility = ' hidden'; ?>
					<?php $time_activity_disabled = ''; ?>
					<?php $distance_activity_disabled = ' disabled'; ?>
					<?php $point_activity_disabled = ' disabled'; ?>
				<?php elseif(in_array($profile['disciplines'][1], array('high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'))): ?>
					<?php $time_activity_visibility = ' hidden'; ?>
					<?php $distance_activity_visibility = ''; ?>
					<?php $point_activity_visibility = ' hidden'; ?>
					<?php $time_activity_disabled = ' disabled'; ?>
					<?php $distance_activity_disabled = ''; ?>
					<?php $point_activity_disabled = ' disabled'; ?>
				<?php elseif(in_array($profile['disciplines'][1], array('pentathlon', 'heptathlon', 'decathlon'))): ?>
					<?php $time_activity_visibility = ' hidden'; ?>
					<?php $distance_activity_visibility = ''; ?>
					<?php $point_activity_visibility = ' hidden'; ?>
					<?php $time_activity_disabled = ' disabled'; ?>
					<?php $distance_activity_disabled = ''; ?>
					<?php $point_activity_disabled = ' disabled'; ?>
				<?php endif; ?>
	
				<div id="time_activity" class="row performance_input<?php echo $time_activity_visibility; ?>">
					<!-- time measure -->
					<?php echo $language['enter_your_time']; ?>:<br>
					<div>
						<label for="hours_input" ><?php echo $language['hours']; ?></label>
						<input name="hours" id="hours_input" size="2" maxlength="2" onkeyup="if(this.value.length&gt;=2) document.add_activity_form.minutes.focus()"<?php echo $time_activity_disabled; ?> >	:
					</div>
					<div>
						<label for="minutes_input"><?php echo $language['minutes']; ?></label>
						<input name="minutes" id="minutes_input" size="2" maxlength="2" onkeyup="if(this.value.length&gt;=2) document.add_activity_form.seconds.focus()"<?php echo $time_activity_disabled; ?>>	:
					</div>
					<div>
						<label for="seconds_input"><?php echo $language['seconds']; ?></label>
						<input name="seconds" id="seconds_input" size="2" maxlength="2" onkeyup="if(this.value.length&gt;=2) document.add_activity_form.centiseconds.focus()"<?php echo $time_activity_disabled; ?>> .
					</div>
					<div>
						<label for="centiseconds_input"><?php echo $language['centiseconds']; ?></label>
						<input name="centiseconds" id="centiseconds_input" size="2" maxlength="2"<?php echo $time_activity_disabled; ?>>
					</div>
					<!-- /time measure -->
				</div>
			
				<div id="distance_activity" class="row performance_input<?php echo $distance_activity_visibility; ?>">
					<!-- distance measure -->
					<?php echo $language['enter_your_performance']; ?>:<br>
					<div>
						<label for="distance_1_input"><?php echo $language['meters']; ?></label>
						<input name="distance_1" id="distance_1_input" size="2" maxlength="2" onkeyup="if(this.value.length&gt;=2) document.add_activity_form.distance_2.focus()"<?php echo $distance_activity_disabled; ?>>	.
					</div>
					<div>
						<label for="distance_2_input"><?php echo $language['centimeters']; ?></label>
						<input name="distance_2" id="distance_2_input" size="2" maxlength="2"<?php echo $distance_activity_disabled; ?>>
					</div>
					<!-- /distance measure -->
	
				</div>
			
				<div id="point_activity" class="row performance_input<?php echo $point_activity_visibility; ?>">
					<!-- points measure -->
					<span class="required">*</span>Enter your performance:<br>
					<div>
						<label for="points_input"><?php echo $language['points']; ?></label>
						<input type="text" id="points_input" name="points"<?php echo $point_activity_disabled; ?>></input>
					</div>
					<!-- /points measure -->
				</div>
	
				<!-- DATE -->
				<div class="row">
					<label for="date_input"><?php echo $language['date']; ?>: </label>
					<input id="date_input" name="date" class="js__datepicker" type="text" placeholder="" value="<?php echo date('d F, Y', time()); ?>">
				</div>
				<!-- DATE -->
				
				<div class="row">
					<!--<label for="public_input">Public/Private</label> -->
	
					<div class="onoffswitch">
					    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
					    <label class="onoffswitch-label" for="myonoffswitch">
					        <div class="onoffswitch-inner"></div>
					        <div class="onoffswitch-switch"></div>
					    </label>
					</div>
				</div>
				
			</div>
			
			<!-- additional info-->
			<div class="right_column">
				<!-- TIME -->
				<div class="row">
					<label for="time_input"><!-- <?php echo $language['date']; ?> --> Time: </label>
					<input id="time_input" name="time" class="js__timepicker" type="text" placeholder="">
				</div>
				
	
				<div class="row">
					<label for="place_input"><?php echo $language['place']; ?>: </label>
					<input type="text" id="place_input" name="place"></input>
				</div>
	
				<div class="row">
					<label for="location_input"><?php echo $language['location']; ?>: </label>
					<input type="text" id="location_input" name="location"></input>
				</div>
	
				<div class="row">
					<label for="competition_input"><?php echo $language['competition']; ?>: </label>
					<input type="text" id="competition_input" name="competition"></input>
				</div>
	
				<div class="row">
					<label for="notes_input"><?php echo $language['notes']; ?>: </label>
					<textarea rows="2" id="notes_input" name="notes"></textarea>
				</div>
				
	
				
				
			</div>
			
			<div class="row"><input type="submit" name="new_competition" value="<?php echo $language['submit']; ?>"></div>
		</form>
	</div>
	
<!-- 	user's timeline -->

<ul class="timeline">
	<?php foreach($activities as $activity): ?>
		<li>
			<div class="direction-l">
				<img class="timeline_thumb" src="../images/profile_pics/003.png">
			</div>
			<div class="direction-r">
				<div class="flag-wrapper">
					<span class="flag"><?php echo $language[$activity['discipline']]; ?> : <?php echo $activity['performance']; ?></span>
					<span class="time-wrapper"><span class="time"><?php echo $activity['date_time']['value']; ?></span></span>
				</div>
				<div class="desc"><?php echo $activity['place'] . '&nbsp;' . $language['@'] . '&nbsp;' . $activity['competition']; ?>.<br><?php echo $activity['location']; ?></div>
			</div>
		</li>
	<?php endforeach; ?>

	<!-- Item 1 -->
<!--
	<li>
		<div class="direction-r OR -l">
			<div class="flag-wrapper">
				<span class="flag">High Jump : 2.18</span>
				<span class="time-wrapper"><span class="time">1 October, 2013 | 16:30</span></span>
			</div>
			<div class="desc">2nd @ World Junior Championship 2013. <br> Debrecen, Hungary</div>
		</div>
	</li>
-->
    
</ul>

	
	
	
	
<!-- 	empty state ~ big quote -->
	<div>
		<div class="big_quote">"Gold medals aren't really made of gold. They're made of sweat, determination, and a hard-to-find alloy called guts." ~ Dan Gable
		</div>
	</div>
	
</div>