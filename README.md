# Stringmatch_typed_naming: Functions to pre-process typewritten answers (in picture naming tasks)

R functions to pre-process typewritten answers in language production experiments, including the application of string distance metrices as implemented in the *stringdist* package ([van der Loo, 2014](https://journal.r-project.org/archive/2014/RJ-2014-011/index.html)). 

## The functions
The [script](https://github.com/kirstenstark/stringmatch_typed_naming/blob/main/stringmatch_typed_naming.R) contains five functions that allow to automatically preprocess typed answers, e.g. from a picture naming task: 
- Delete spaces or enter keys at the end of a typed word,
- Replace special keys such as backspace, shift, etc., 
- Apply backspace-corrections,
- Compute fuzzy string matching (wrap-around function to the *stringdist* package that allows to identify the "best match" comparison to the typed word, which could be either the item or a synonym [list needs to be given]), and 
- Classify different error types  

The functions can be applied individually or subsequently. 

## How to
The functions were computed for typewritten answers where all pressed keys are recorded. One JavaScript-based implementation to record typewritten answers is provided [here](https://github.com/kirstenstark/typing_RTs_JS).  
Researchers interested in using these functions should (1) download the [.R file containing the functions](https://github.com/kirstenstark/stringmatch_typed_naming/blob/main/stringmatch_typed_naming.R), (2) save the file in the same folder as their scripts, (3) and load the functions from their script using the source()-function in R (`source("stringmatch_typed_naming.R")`). 

## Examples
An exemplary application of the functions is provided [here](https://github.com/kirstenstark/stringmatch_typed_naming/tree/main/example).  
The functions were also used for our preprint: add-preprint-here.

## Beta Version for online feedback
I've also added a jsPsych plugin that assesse the correctness of participants' responses by using the Levenshtein distance as implemented by [Andrei Mackenzie] (https://gist.github.com/andrei-m/982927) and the custom functiosn previously discribed. This plugin several options implemented to be customized, but is still relatively bound to the paradigm it was programmed for. A more general implementation is to be added soon. For now, you can find the plugin [here] (https://github.com/kirstenstark/stringmatch_typed_naming/blob/main/online_implementation_jspsych/jspsych-levenshtein_distance.js). 

## Citation
If you decide to use these functions, I'd be happy if you would cite them: 
Stark, K. (2021). Stringmatch_typed_naming. GitHub Repository. [https://github.com/kirstenstark/stringmatch_typed_naming](https://github.com/kirstenstark/stringmatch_typed_naming)

## Any comments, suggestions, extensions?
... please let me know!

### License

This work was created by Kirsten Stark at the Humboldt-Universität zu Berlin and is subject to the [MIT License](https://github.com/kirstenstark/stringmatch_typed_naming).
