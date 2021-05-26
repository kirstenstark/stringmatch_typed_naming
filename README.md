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

## Citation
If you decide to uses these functions, I'd be happy if you would cite them: 
Stark, K. (2021). Stringmatch_typed_naming. GitHub Repository. [https://github.com/kirstenstark/stringmatch_typed_naming](https://github.com/kirstenstark/stringmatch_typed_naming)

## Any comments, suggestions, extensions?
... please let me know!
