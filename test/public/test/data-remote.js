module('data-remote', {

  teardown: App.teardown,

  setup: function() {
    $('#fixtures').append($('<a />', {
      href: '/echo',
      'data-remote': 'true',
      text: 'my address'
    }));
    
    var form = $('<form />', {
      action: '/echo',
      'data-remote': 'true',
      method: 'post'
    });

    form.append($('<input />', {
      id: 'user_name',
      type: 'text',
      size: '30',
      'name': 'user_name',
      'value': 'john'
    }));

    $('#fixtures').append(form);

  }
});

test('clicking on a link with data-remote attribute', function() {
  expect(3);
  stop(App.ajax_timeout);

  $('a[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = data.request_env;
      App.assert_request_path(request_env, '/echo');
      App.assert_get_request(request_env); 

      start();
    })
    .trigger('click');
});

test('Submitting form with data-remote attribute', function() {
  expect(4);
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');

      var request_env = data.request_env,
          params = request_env['rack.request.query_hash'];

      App.assert_request_path(request_env, '/echo');
      equals(params['user_name'], 'john', 'ajax arguments shouldh ave key user_name with right value');
      App.assert_post_request(request_env); 

      start();
    })
    .trigger('submit');
});

