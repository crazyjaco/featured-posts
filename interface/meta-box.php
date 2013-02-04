<?php wp_nonce_field('bu_feature', 'bu_feature_nonce', false); ?>
<div class="post-selector first" id="bu_feature">
	<ul id="bu_feature_selected_posts"><?php
	if (!empty($feature)) {
		$i = 0;
		$count = count($feature);
			while ($i < $count) {
				
				if ($feature[$i]['feature_type'] === 'article') {
					$icon = '<img src="../wp-content/plugins/featured-posts/interface/images/icon_polaroid.gif" height="16" width="16" />';					
				} elseif ($feature[$i]['feature_type'] === 'media') {
					$icon = '<img src="../wp-content/plugins/featured-posts/interface/images/icon_film.gif" height="16" width="16" />';
				} else {
					$icon = '';
				}

				print "<li>" . $icon . "<input type='hidden' id='bu_feature_type' name='bu_feature[feature_type][]' value='" . $feature[$i]['feature_type'] .
					"'/><input type='hidden' id='bu_feature_post_id' name='bu_feature[post_id][]' value='" . $feature[$i]['post_id'] . 
					"'/><input id='bu_feature_custom_title' class='bu_title' name='bu_feature[title][]' type='text' value='" . $feature[$i]['title'] .
					"'/> <button class='button remove'>Remove</button></li>\n";
					$i++;
			}
	} ?></ul>
	<button class="button replace">Add</button>
</div>
