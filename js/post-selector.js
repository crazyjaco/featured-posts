jQuery(function($) {
	var $activeSelector = null;
	var nonce = $('#bu_post_search').find('[name="nonce"]').val();
	var fetchingPosts = false;
	var fetchingMedia = false;
	var page = 1;

	$('#bu_post_selector').dialog({
		autoOpen: false,
		height: 400,
		width: 640,
		modal: true,
		title: 'Select Post',
		open: function() {
			$(this).scrollTop(0);
			$('#bu_post_search_query').focus();
			getPosts();
		},
		buttons: {
			Cancel: function() {
				$(this).dialog("close");
			}
		},
		close: function() {
			$activeSelector = null;
		}
	});

	$('#bu_media_selector').dialog({
		autoOpen: false,
		height: 400,
		width: 640,
		modal: true,
		title: 'Select Media',
		open: function() {
			$(this).scrollTop(0);
			var post_id = $('#bu_media_selector').data('ID');
			console.dir(dataObj);
			getMedia(post_id);
		},
		buttons: {
			Cancel: function() {
				$(this).dialog("close");
			}
		},
		close: function() {
			$activeSelector = null;
		}
	});

	var updatePostSelector = function(e) {
		var $selector = $(this);
		var baseID = $selector.attr('id');

		var feature_type_image = e.post.feature_type === 'article' ? '<img src="../wp-content/plugins/featured-posts/interface/images/icon_polaroid.gif" height="16" width="16" />' : '<img src="../wp-content/plugins/featured-posts/interface/images/icon_film.gif" height="16" width="16" />';
console.log(e.post.feature_type);
		$('#bu_feature_selected_posts').append( $('<li><input type="hidden" id="bu_feature_post_id" name="bu_feature[post_id][]" value="' + e.post.ID + 
			'"/><input type="hidden" id="bu_feature_type" name="bu_feature[feature_type][]" value="' + e.post.feature_type +
			'"/>' + feature_type_image + '<input id="bu_feature_custom_title" class="bu_title" name="bu_feature[title][]" type="text" value="' + e.post.title + 
			'"/> <button class="button remove">Remove</button></li>'))
			.find('.remove')
			.unbind('click')
			.bind('click', removeItem);

		if(e.post.image) {
			var sizes = ['thumbnail', 'small', 'medium', 'large'];
			for(var i = 0; i < sizes.length; i++) {
				var url = e.post.image[sizes[i]]['url'];
				if(url) {
					var $img = $('<img/>').attr('src', e.post.image[sizes[i]]['url']);
					$selector.find('.image-' + sizes[i])
					.html($img);

				}
			}
		} else {
			$selector.find('.image')
				.hide()
				.find('img').remove();
		}

		if($selector.find('.image img').length > 0) {
			$selector.find('.image').show();
		}
	}

	var openSelectorDialog = function(e) {
		e.preventDefault();

		$activeSelector = $(this).closest('.post-selector');

		$('#bu_post_search_results').html('');
		$('#bu_post_search').find('[name="s"]').val('');
		$('#bu_post_selector').dialog('open');

	}

	var showResults = function(results) {
		var $results = $('#bu_post_search_results');
		$results.html('');
		if(results == null) {
			$results.html('<li><em>No posts found.</em></li>');
		} else {
			addResults(results);
		}
	}

	var addResults = function(results) {
		var $results = $('#bu_post_search_results');

		$.each(results, function(i, result) {

			var media_btn = result.mediaurl === "" ? '' : '<button name="submit-media">Feature Media</button>';
			console.log('media_btn: ' + media_btn);
			var snippet =  '<li><a><span class="item-title"></span><span class="item-info"></span></a>' +
								'<span class="button-feature-article"><button name="submit-article">Feature Article</button></span>' +
								'<span class="button-feature-media">' + media_btn + '</span></li>';

			var $snippet = $(snippet)
				.find('.button-feature-article')
				.data(result).end()
				.find('.button-feature-media')
				.data(result).end();
			$snippet.find('.item-title').text(result.title);
			if(result.status == 'publish') {
				$snippet.find('.item-info').text(result.date);
			} else {
				$snippet.find('.item-info').text(result.status);
			}

			// Come back to this (creates a thumbnail for each post in the post selector dialog)
			if(result.image) {
				if(result.image.thumbnail.url) {
					$snippet.find('a').prepend($('<img/>').attr('src', result.image.thumbnail.url));
				}
			}
			$results.append($snippet);
		});
		$results.children('li').filter(':odd').addClass('odd');
		setTimeout( function() { fetchingPosts = false; }, 1000);
	}

	var removeItem = function(e) {
		e.preventDefault();

		$(this).closest('li').remove();

	}


	var $postSelectors = $('.post-selector');
	$postSelectors.bind('updatePostSelector', updatePostSelector);
	$postSelectors.find('.replace').bind('click', openSelectorDialog);
	$postSelectors.find('.remove').bind('click', removeItem);

	$('#bu_post_search').submit(function(e){
		e.preventDefault();
		getPosts($(this).find('[name="s"]').val(), 1);
	});


	$('#bu_post_selector').scroll(function() {
		var $box = $(this);
		if(!fetchingPosts &&
			($box.scrollTop() >= ($box.find('.inner').height() - $box.height()))) {
			page++;
			getPosts($box.find('[name="s"]').val(), page);
		}
	});

	var getPosts = function(searchQuery, page) {
		var post_types = $activeSelector.data('post_types');

		fetchingPosts = true;

		if(!post_types) {
			post_types = '';
		}
		if(!page) {
			page = 1;
		}

		var data = {
		    nonce: nonce,
		    action: 'bu_get_posts',
		    post_types: post_types,
		    page: page

		};

		if(searchQuery) {
			data.s = searchQuery;
		}
		$.post(ajaxurl, data, function(results) {
			console.dir(results);
			if(page == 1) {
				showResults(results);
			} else {
				addResults(results);
			}
		}, 'json');

	}

	var getMedia = function(id) {
		fetchingMedia = true;

		var data = {
			nonce: nonce,
			action: 'bu_get_media',
			post_id: id
		};

		$.post(ajaxurl, data, function(results) {
			console.dir(results);
		}, 'json');

	}
console.log('got here at all');
	$('#bu_post_search_results .button-feature-article').live('click', function(e) {
		e.preventDefault();
	//	console.log('got here first');
		$(this).closest('span').data('feature_type', 'article');
		$activeSelector.trigger({type: 'updatePostSelector', post: $(this).closest('span').data()});
	//	console.log('got here second');
		$('#bu_post_selector').dialog('close');
	});

	$('#bu_post_search_results .button-feature-media').live('click', function(e) {
		e.preventDefault();
		$(this).closest('span').data('feature_type', 'media');
		$activeSelector.trigger({type: 'updatePostSelector', post: $(this).closest('span').data()});
		$('#bu_post_selector').dialog('close');
	dataObj = $(this).data();
		console.dir(dataObj);
	//	$('#bu_media_selector').data(dataObj);
	//	$('#bu_media_selector').dialog('open');
		
	});
});

