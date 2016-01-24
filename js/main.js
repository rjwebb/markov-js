  var current_model = undefined;

  var file_data = "";

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    file_data = "";

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
	  file_data += e.target.result;
        };
      })(f);

      reader.readAsText(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);


  function add_sentence_breaks(tokens){
    var o = [{sentence_break: true}];

    _.each(tokens, function(token) {

      if(_.last(token) == '.'){
	var w = token.slice(0, -1);
	o.push( {word: w, sentence_break: false} );
	o.push( {sentence_break: true} );
      }else{
	o.push( {word: token, sentence_break: false} );
      }

    });

    return o;
  }

  function bigrams(l){
    var o = [];

    for(var i=0; i < l.length-1; i++){
      o.push( [ l[i], l[i+1] ] );
    }

    return o;
  }

  function generate_model(t){
    var initials = [];

    var transitions = Object.create(null);

    var words = t.split(/\s+/g);
    var text_bigrams = bigrams(add_sentence_breaks(words));

    _.each(text_bigrams, function(elem) {
      var e0 = elem[0];
      var e1 = elem[1];

      if( e0.sentence_break ){
	var w1 = e1.word;
	initials.push(w1);

      } else {
	var w0 = e0.word;
	var w1 = e1.sentence_break ? e1 : e1.word;
	(transitions[w0] = transitions[w0] || []).push(w1);
      }
    });

    return {
      initials: initials,
      transitions: transitions
    }
  }

  function unif_choice(things){
    var index = Math.floor(Math.random() * things.length);
    return things[index];
  }


  function sample_model(model){
    // do the thing
    var out = [];

    // ok this is ugly but amuses me
    for(var word = unif_choice(model.initials); !word.sentence_break; word = unif_choice(model.transitions[word]) ){
      out.push(word);
    }

    return out;
  }

  $('#sample-model').hide();

  $('#submit-passage').click(function(e){
    
    if(file_data){
	current_model = generate_model(file_data);
	$('#sample-model').show();
    }
  });

  var num_quotes = 10;

  $('#sample-model').click(function(e){
    $('#output-sample').html('');

    if(current_model){
      for(var i = 0; i < num_quotes; i++){
	var o = sample_model(current_model);
	var t = o.join(' ') + ".";

	var e = "<div class='list-group-item'>"+t+"</div>";
	$('#output-sample').append(e);
      }
    }
  });
