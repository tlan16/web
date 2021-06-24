---
title: "Building from source"
date: 2021-06-26T00:00:00+00:00
weight: 50
geekdocRepo: https://github.com/owncloud/web
geekdocEditPath: edit/master/docs
geekdocFilePath: conventions.md
---

{{< toc >}}

This is a collection of conventions we try to stick with when working on [the ownCloud web frontend](https://github.com/owncloud/web). 
It is a living document, please open a PR if you find something missing.

## Repo Conventions



### SemVer Definitions

**Bugfix:** Removes unwanted behaviour or reverts a regression.
**Feature:** Everything that adds new functionality in a backwards-compatible way.
**Breaking Change:** Everything that requires an interaction either on the part of a ownCloud admin or by an extension developer.

### Changelog items

Required for every change that influences the user experience (both end-users and extension developers).
Optional for refactoring, dependency updates, adding tests and the likes.

## Code Conventions

### Early returns

We're trying to stick with early returns in our code to make it more performant and simply reasoning about it.

### Translations

Use `v-translate` inside HTML tags (instead of a `<translate tag="h1">` or similar) in order to make reasoning about the DOM tree easier.

### Wording

Start with a capital letter and then write everything else like it would be in a normal sentence
