/* Custom plugin to calculate Levenshtein distance
*   Author: Kirsten Stark (https://github.com/kirstenstark/typing_RTs_JS)
*   Description: This is a custom plugin that allows to collect preprocess 
                 the typewritten answers, to collect the Levensthein distances
                 between the typed answers, the playing card the participant 
                 has actually seen and the associated playing card.
                 The Levenshtein distance was implemented by Andrei Mackenzie
                 (2001), publicly available at: https://gist.github.com/andrei-m/982927
*/

// --------- DEFINE INPUT VARIABLES/POSSIBLE SETTINGS ---------//

jsPsych.plugins["levenshtein_distance"] = (function() {

  var plugin = {};
  
  plugin.info = {
    name: "levenshtein_distance",
    parameters: {
      playing_card: {
        type: jsPsych.plugins.parameterType.STRING, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
        default_value: undefined,
        pretty_name: 'playing_card', 
        description: 'playing card participant has seen in last trial'
      },
      associated: {
        type: jsPsych.plugins.parameterType.STRING, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
        default_value: undefined,
        pretty_name: 'associated_playing_card', 
        description: 'playing card associated to the actual playing card participant has seen in last trial'
      },
      input: {
        type: jsPsych.plugins.parameterType.STRING, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
        default_value: '',
        pretty_name: 'participants_typed_input', 
        description: 'the word participants typed in the last trial'
      },
      distance: {
        type: jsPsych.plugins.parameterType.INT, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
        default_value: 3,
        pretty_name: 'Levenshtein distance cutoff', 
        description: 'below this distance between the typed answer and the shown/associated playing card, typed answers are considered as correct'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // --------- DEFINE ALL NECESSARY FUNCTIONS ---------//

    // delete " " or "enter" at the end of the input
    delete_ending = function(input) {
      var test = 0;
      input = input.toLowerCase();
      while(test == 0) {
        if(input.endsWith(" ")) {
           input = input.slice(0, -1);
        } else if(input.endsWith("Enter") || input.endsWith("enter") || input.endsWith("ENTER")) {
           input = input.slice(0, -5);
        } else {
          console.log('Ending deleted.');
          return(input);
        }
      }
    }

    // replace various character special keys by one-digit numbers
    replace_special_chars  = function(input, newnames=[3,3,3,3,3,3,3,3,3,3,3,1,2,4]) {
      oldnames = ["tab", "alt", "meta", "arrowleft", "arrowright", "arrowdown", "arrowup", "enter", "process", "delete", "dead", "shift","capslock","backspace"];
      //newnames = [3,3,3,3,3,3,3,3,3,3,3,1,2,4]; // 1 is shift, 2 is capslock, 4 IS BACKSPACE, 3 are all other special keys
      for (let i = 0; i < oldnames.length; i++) {
          // loop through all possible special characters and replace them by one-digit numbers. 
          // CAVE: If backspace corrections should be applied later, please remind to assign a different number to the backspaces
        input = input.replaceAll(oldnames[i], newnames[i]);
        //console.log('The pattern '+oldnames[i]+' has been replaced by the pattern '+newnames[i]);
      }
      console.log('Special characters replaced.');
      return(input);
    } 

    // apply backspace corrections
    replace_backspace = function(input, backspace = 4) {
      index = input.indexOf(backspace);
      console.log(index);
      if(index == -1) {
        return input;
      }
      while(index !== -1) {
        if(index !== 0) {
          console.log('index not 0');
          input = input.substring(0, index-1) + input.substring(index + 1);
          index = input.indexOf(backspace);
        } else if (index == 0) {
          console.log('index is zero')
          input = input.substring(index + 1);
          index = input.indexOf(backspace);
        } //else {
          //console.log('Backspace correction applied.');
          //return input;
        //}
      }
      return input;
    }

    // calculate Levensthein distance
    /// Code taken from Andrei Mackenzie (2001; https://gist.github.com/andrei-m/982927 )
    //// Compute the edit distance between the two given strings
  string_distance = function(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                            Math.min(matrix[i][j-1] + 1, // insertion
                            matrix[i-1][j] + 1)); // deletion
        }
      }
    }
    return matrix[b.length][a.length];
    };



    // --------- APPLYING FUNCTIONS ---------//

    // delete endings, replace special characters and apply backspace corrections
    var input = delete_ending(trial.input);
    console.log(input);
    input = replace_special_chars(input);
    console.log(input);
    input = replace_backspace(input);
    console.log(input);

    // create output variable that will be displayed underneath the picture for the partner
    output=replace_special_chars(input,newnames=['','','','','','','','','','','','','',4]);
    output=replace_backspace(output);


    // calculate Levenshtein distance between typed word, actual playing card, 
    // and associated card
    var distance_card = string_distance(input, trial.playing_card.toLowerCase());
    console.log('Distance to actual playing card ('+trial.playing_card+'): '+ distance_card);
    var distance_associated = string_distance(input, trial.associated.toLowerCase());
    console.log('Distance to associated card ('+trial.associated+'): '+ distance_associated);

    // evaluate wheter participant typed the name of the actual playing card or of the associated card
    if (distance_card < trial.distance & distance_associated < trial.distance & distance_card == distance_associated) {
      var distance_based_eval = "unclear";
    } else if (distance_card < trial.distance && distance_card < distance_associated) {
      var distance_based_eval = "shown_card";
    } else if (distance_associated < trial.distance && distance_associated < distance_card) {
      var distance_based_eval = "associated_card";
    } else if (distance_card == distance_associated) {
      var distance_based_eval = "unclear_but_distant";
    } else if (distance_card < trial.distance+2 && distance_card < distance_associated) {
      var distance_based_eval = "maybe_shown_card";
    } else if (distance_card < trial.distance+2 && distance_card < distance_associated) {
      var distance_based_eval = "maybe_associated_card";
    } else {
      var distance_based_eval = "completely_unclear";
    }

    console.log(distance_based_eval);

    // //ask which object participant meant if answer was unclear
    // if(distance_based_eval == "unclear" ||  distance_based_eval = "unclear_but_distant" || distance_based_eval == "completely_unclear") {
    //   display_element.innerHTML='<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>'
    //   function functionConfirm(msg, myYes, myNo) {
    //            var confirmBox = $("#confirm");
    //            confirmBox.find(".message").text(msg);
    //            confirmBox.find(".yes,.no").unbind().click(function() {
    //               confirmBox.hide();
    //            });
    //            confirmBox.find(".yes").click(myYes);
    //            confirmBox.find(".no").click(myNo);
    //            confirmBox.show();
    //         }
    //     display_element.innerHTML='<style>#confirm {display: none;background-color: #91FF00;border: 1px solid #aaa;\
    //       position: fixed;width: 250px;left: 50%;margin-left: -10;padding: 6px 8px 8px;box-sizing: border-box;text-align: center;}\
    //       #confirm button {background-color: #48E5DA;display: inline-block;border-radius: 5px;border: 1px solid #aaa;padding: 5px;\
    //       text-align: center;width: 80px;cursor: pointer;}\
    //       #confirm .message {text-align: left;}</style>\
    //       <div id="confirm">\
    //         <div class="message"></div>\
    //         <button class="yes">Yes</button>\
    //         <button class="no">No</button>\
    //      </div>\
    //      <button onclick = 'functionConfirm("Do you like Football?", function yes() {alert("Yes")},function no() {alert("no") });'>submit</button>';
    //       }

    // display alert with the possible answer alternatives if typewritten answer is unclear
    if(distance_based_eval == "unclear" || distance_based_eval == "unclear_but_distant" || 
    distance_based_eval == "maybe_shown_card" || distance_based_eval == "maybe_associated_card" || 
    distance_based_eval == "completely_unclear") {
      var evaluation = 'unclear';
      alert("Achtung: Bitte denken Sie daran, dass "+trial.playing_card.toUpperCase()+" und "+trial.associated.toUpperCase()+
      " bei dieser Karte die einzigen validen Optionen sind!\n(Ihr Partner/Ihre Partnerin sieht diese Warnung nicht)");
    } else if ( distance_based_eval == "shown_card") {
      var evaluation = 'shown card';
    } else {
      var evaluation = 'associated card';
    }
   //console.log(evaluation);
    
    

    // data saving
    var trial_data = {
      "typed_word": trial.input,
      "corrected_typed_word": input,
      "Levenshtein distance": '<'+trial.distance,
      "distance_shown_card": distance_card,
      "distance_associated_card": distance_associated,
      "distance_based_eval": distance_based_eval,
      "evaluation": evaluation,
      "outputforpartner": output
    };
    input = '';
    distance_card = undefined;
    distance_card = undefined;
    distance_based_eval='';

    // end trial
    display_element.innerHTML = "";
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();