<?php wp_nonce_field('bu_feature', 'bu_feature_nonce', false); ?>
<div class="post-selector first" id="bu_feature">
	<ul id="bu_feature_selected_posts"><?php
	if (!empty($feature)) {
		$i = 0;
		$count = count($feature);
			while ($i < $count) {
				print "<li><input type='hidden' id='bu_feature_post_id' name='bu_feature[post_id][]' value='" . $feature[$i]['post_id'] . 
					"'/><input id='bu_feature_custom_title' class='bu_title' name='bu_feature[title][]' type='text' value='" . $feature[$i]['title'] .
					"'/> <button class='button remove'>Remove</button></li>\n";
					$i++;
			}
	} ?></ul>
	<button class="button replace">Add</button>
</div>
