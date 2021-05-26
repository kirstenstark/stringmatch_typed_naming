Stringmatch\_typed\_naming: Exemplary application
================
Kirsten Stark
22/05/2021

## Load packages

``` r
# # if necessary: install packages
# install.packages("here")
# install.packages("tictoc")
# install.packages("tidyr")
# install.packages("dplyr")
# install.packages("stringr")
# install.packages("stringdist")

# # alternatively: open the R project example.R, 
# # and install the package versions that were 
# # used when the functions originally were created
# # under R version 4.0.2 using the renv-package
# # (Ushey, 2020)
# # install.packages("renv")
# renv::restore()

# clean workspace
rm(list = ls())

# load packages
library(tidyr)
library(dplyr)
```

    ## 
    ## Attaching package: 'dplyr'

    ## The following objects are masked from 'package:stats':
    ## 
    ##     filter, lag

    ## The following objects are masked from 'package:base':
    ## 
    ##     intersect, setdiff, setequal, union

``` r
library(stringr)
library(stringdist)
```

    ## 
    ## Attaching package: 'stringdist'

    ## The following object is masked from 'package:tidyr':
    ## 
    ##     extract

``` r
# necessary encoding depends on the language
options( "encoding" = "UTF-8" )
```

## Load stringmatch\_typed\_naming functions

The R script with the functions should be saved in your working
directory.  
This code should load five functions called: delete\_ending,
replace\_special\_chars, replace\_backspace, calculate\_stringdist, and
case\_character\_type.

``` r
source(here::here("stringmatch_typed_naming.R"))
```

## Load exemplary data

``` r
# data file
input <- "data.csv"

# file with alternative naming
alternatives <- "alternatives.csv"

df <- read.csv(here::here(input))
alternatives <- read.csv(here::here(alternatives),sep=";")
```

## Preprocess data, applying functions

Other types of data and settings might only need a subset of functions,
e.g. when no corrections were allowed

### 1\) delete\_ending: Function to clean word ending by deleting the last character(s) of typed words (if those are space or enter)

As entries, the delete\_ending function takes the column or vector with
the word entries and, optionally, a custom ending. The default endings
are space ("“) and”Enter". Those will be replaced if no alterative
ending is given.

Technically, the function checks whether the last character(s) of the
each typed word is a space or “Enter”, and if so, deletes the last/the
last five characters. If the last character(s) are neither of both, the
word remains unchanged.  
The function can be used within dplyr’s mutate function.

We can repeat applying this function, e.g. in a while or for loop, if we
want to keep deleting Enter and spaces in case they are repeated several
times at the end of the word. The while loops stops as soon as none of
the words has a space or Enter (or custom ending) at the end. (In the
example, this changes only the ending of three words.)

``` r
# if only the very last space or enter should be deleted in case of 
# several spaces or enter keys in a row: 
# df2 <- df %>% mutate(word.c = delete_ending(df$word))

# delete all spaces or enter keys at the end
isnotequal <- 1
df$word.c = currentupdate = df$word
while (isnotequal > 0) {
  df <- df %>% mutate(word.c = delete_ending(df$word.c))
  isnotequal <- sum(currentupdate != df$word.c, na.rm = TRUE)
  currentupdate <- df$word.c
}
```

### 2\) Replace\_special\_chars: Replace special characters/keys (e.g. backspace, shift, etc.) by other characters (e.g. numbers)

In many output formats, special keys such as Enter and Backspace are
written as entire words. We want to replace these with identifiable
numbers.  
The function takes as entries the word entries (data frame column or
vector), a vector of the keys to be changed, and a vector of the
characters/numbers/strings they should be replaced with.  
A character/key can also be replaced by nothing. This may be useful
e.g. when corrections where not allowed, but participants still hit the
backspace button (replace\_special\_chars(input=input,
oldnames=“Backspace”, newnamnes = "")).

``` r
oldnames <- c("Enter", "CapsLock", "Shift", "ArrowLeft", "ArrowRight", "Backspace", "Control")
newnames <- c("1", "2", "3", "4", "5", "6", "7")
df$word.c <- replace_special_chars(input = df$word.c, oldnames = oldnames, newnames = newnames)
```

    ## [1] "The pattern Enter has been replaced by the pattern 1."
    ## [1] "The pattern CapsLock has been replaced by the pattern 2."
    ## [1] "The pattern Shift has been replaced by the pattern 3."
    ## [1] "The pattern ArrowLeft has been replaced by the pattern 4."
    ## [1] "The pattern ArrowRight has been replaced by the pattern 5."
    ## [1] "The pattern Backspace has been replaced by the pattern 6."
    ## [1] "The pattern Control has been replaced by the pattern 7."

### 3\) Replace\_backspace: Function that computes the final words by applying all backspaces

If corrections are allowed, researchers may still want to know what
participants actually typed. Therefore, it may be useful to record all
pressed keys and to apply the effect of the backspaces, namely deleting
the character/key that has been pressed just before the backspace and
the backspace itself. This is what the function replace\_backspace was
programmed for. The function takes as input the word entries and,
optionally, the backspace identifier. The default backspace identifier
is “Backspace”.

``` r
df$word.c <- replace_backspace(df$word.c, backspace = "6")
```

### 4\) Calculate\_stringdist: Compute fuzzy string matching between typed words and items/alternatives using the metrices implemented in the stringdist package (van der Loo, 2014)

The aim of this function is two-fold: (1) Calculate the string distance
between (backspace corrected) input word and item/alternative, and (2)
select the “best match”, i.e. the item/alternative with the lowest
distance to the (backspace corrected) input word. Optionally, potential
“best matches” can also be restricted to items/alternatives of which
the first letter is the same as the (backspace corrected) typed word (if
firstlettercorrect=TRUE, which is the default).  
Per default, the function computes the string matching using the Jaro
distance (Jaro-Winkler distance (“jw”) with p = 0; Jaro, 1995, 1989),
but other methods of the stringdist function in the stringdist package
(van der Loo, 2014) are possible as well.  
“Alternatives should be a data frame of long format with at least one
column called”item" (same entry for as many alternatives as there are
for a specific item) and another column called “alternatives” (one row
for each accepted alternative naming of each item).  
**Compute Jaro-distance:**

``` r
tictoc::tic()
output <- calculate_stringdist(word = df$word.c, # (preprocessed) typed words
                               stims = df$item,  # actual item
                               alternatives = alternatives, # potential alternative namings
                               # options regarding the string distance metrices: 
                               #  see documentation of the stringdist function (stringdist-package; 
                               #  van der Loo, 2014) for documentation
                               method = "jw", p = 0, # the default method: Jaro = Jaro-Winkler with p = 0
                               #weight = c(1,1,1,1), q = 1,
                               firstlettercorrect = TRUE)
tictoc::toc()
```

    ## 1.224 sec elapsed

``` r
df$jaro <- output[,1] # the Jaro distance
df$bestmatch_jaro <- output[,2] # the bestmatch word entry (either item or one of the accepted alternatives)
                                # meaning lowest distance (and identical first character as the typed word)
```

### 5\) Case\_character\_type: Function that classifies the word entries

Function that classifies the word entries for correctness, their best
match, and different typing errors.  
*correct* = Participants typed exactly the correct word, potentially
plus space or enter at the end.  
*correctedtocorrect* = Participants corrected their entry to the exact
correct word using “Backspace”.  
*approx\_correct* = Participants’ typed words include typing errors, but
the string distance is below the cut-off that needs to be set when
applying this function. The best matching word (as defined in the
calculate\_stringdist function) is the actual item.  
*alternative* = Instead of the actual item, participants exactly typed
one accepted alternative, potentially plus space or enter at the end.  
*alternative\_corrected* = Participants corrected their entry to an
exact alternative naming using “Backspace”.  
*approx\_alternative* = Participants’ typed words include typing errors,
but the string distance is below the cut-off that needs to be set when
applying this function. The best matching word (as defined in the
calculate\_stringdist function) is an alternative naming.  
*backspace\_space\_enter* = Participants started by typing backspace,
space, enter, or caps lock.  
shift\_start = Participants started by pressing the shift key (to write
the first letter in upper case). *isna* = Participants didn’t enter
anything until timeout.  
*distance-based error* = Participants’ typed words include typing errors
and the string distance is above or equal the cut-off that needs to be
set when applying this function. *first letter-based error* = First
characters of typed word, backspace-corrected typed word, and
‘bestmatch’ are not identical.  
*not\_correct* = This category was mainly created to test whether all
typed words have been successfully classified (it should be empty
then)  
**If you need different categories, or for instance, if you do not care
whether the first character was typed correctly, you may want to copy
the function and adapt the source code.**

``` r
df <- df %>% 
  mutate(answercode_jaro = case_character_type(word = word, # column with the actual typed word
                                               item = item, # column with the actual item
                                               wordcorrected =  word.c, # column with the preprocessed 
                                                                        # typed word (see functions above)
                                               distance = jaro, # column with the computed distance
                                               bestmatch = bestmatch_jaro, # column with the computed
                                                                            # bestmatches
                                               d = 0.3)) # the distance cut-off to apply
```

### 6\) Classify corretness

Last but not least, you may want to decide which of the above categories
shall be considered as correct. Here, we accept corrections and
indicated several accepted alternatives. Therefore, we accept all typed
words as correct that are typed perfectly correct, that are typed
perfectly correct after backspace-correction, and that contain typing
errors but whose distance to the best match (either item or alternative)
is below the defined cut-off. All typed entries are either compared to
the actual item or the best-match alternative.  
1 = correct, 0 = incorrect

``` r
df <- df %>% 
  mutate(correct_jaro = case_when(
    answercode_jaro == "correct" ~ 1,
    answercode_jaro == "correctedtocorrect" ~ 1,
    answercode_jaro == "approx_correct" ~ 1,
    answercode_jaro == "alternative" ~ 1,
    answercode_jaro == "alternative_corrected" ~ 1,
    answercode_jaro == "approx_alternative" ~ 1,
    TRUE ~ 0))
```

## Inspect results

Summarize the different typing classifications (across participants):

``` r
as.data.frame(table(df$correct_jaro, df$answercode_jaro)) %>% filter(Freq != 0)  %>% 
  mutate(percentage = round(case_when(Var1 == 1 ~ Freq/sum(df$correct_jaro == 1),
                                Var1 == 0 ~ Freq/sum(df$correct_jaro == 0)),4)*100) %>%
  rename(correct=Var1, answercode=Var2, frequency=Freq)
```

    ##    correct            answercode frequency percentage
    ## 1        1 alternative_corrected       302       7.06
    ## 2        1    approx_alternative        23       0.54
    ## 3        1        approx_correct       133       3.11
    ## 4        0 backspace_space_enter        25       4.79
    ## 5        1               correct      3519      82.26
    ## 6        1    correctedtocorrect       301       7.04
    ## 7        0  distance_based_error        12       2.30
    ## 8        0    first_letter_error       233      44.64
    ## 9        0                  isna       153      29.31
    ## 10       0           not_correct        89      17.05
    ## 11       0           shift_start        10       1.92

Summarize the answers classified as correct (across participants):

``` r
as.data.frame(table(df$correct_jaro)) %>% 
  rename(correctness=Var1) %>% 
  # raw number of correct trials
  rename(frequency_incl_fillers=Freq) %>% 
  # percentage of correct trials (including fillers)
  mutate(percentage_incl_fillers= round(
    table(df$correct_jaro)/nrow(df)*100,2))  %>%
  # number of correct trials (excluding fillers)
  mutate(frequency_excl_fillers = table(
    df$correct_jaro[df$category != "Filler"])) %>%
  # percentage of correct trials (excluding fillers)
  mutate(percentage_excl_fillers = round(
    table(df$correct_jaro[df$category != "Filler"])/
      nrow(df[df$category != "Filler",])*100,2))
```

    ##   correctness frequency_incl_fillers percentage_incl_fillers
    ## 1           0                    522                   10.88
    ## 2           1                   4278                   89.12
    ##   frequency_excl_fillers percentage_excl_fillers
    ## 1                    423                   11.75
    ## 2                   3177                   88.25
