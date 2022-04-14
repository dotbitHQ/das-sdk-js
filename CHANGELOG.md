# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.0](https://github.com/DeAccountSystems/das-sdk/compare/v1.5.0...v1.6.0) (2022-04-14)


### Features

* add static method `toDottedStyle` & `toHashedStyle` ([0ebc350](https://github.com/DeAccountSystems/das-sdk/commit/0ebc350928e16aadcda56adde578ea013ba1fb98))

## [1.5.0](https://github.com/DeAccountSystems/das-sdk/compare/v1.3.0...v1.5.0) (2022-04-13)


### Features

* add `toHashedStyle` & `toDottedStyle` ([6f4c0ba](https://github.com/DeAccountSystems/das-sdk/commit/6f4c0ba9424ee9aba52a63f1f93619cccd4a0cfb))
* add test for sub-account ([21354f0](https://github.com/DeAccountSystems/das-sdk/commit/21354f06d957f2688ce38e29ae447b08ba34fba5))

## [1.3.0](https://github.com/DeAccountSystems/das-sdk/compare/v1.1.2...v1.3.0) (2022-03-08)


### Features

* add method `accountsForOwner` ([0e6be6f](https://github.com/DeAccountSystems/das-sdk/commit/0e6be6f9fbf969e36c77971c4d3374d76215435b))


### Bug Fixes

* add missing dependency `node-fetch` ([4009afe](https://github.com/DeAccountSystems/das-sdk/commit/4009afe9da6deea4677c76ff79b99de439299ba9))

### [1.1.5](https://github.com/DeAccountSystems/das-sdk/compare/v1.1.2...v1.1.5) (2021-12-29)


### Bug Fixes

* add missing dependency `node-fetch` ([4009afe](https://github.com/DeAccountSystems/das-sdk/commit/4009afe9da6deea4677c76ff79b99de439299ba9))

### [1.1.2](https://github.com/DeAccountSystems/das-sdk/compare/v1.1.0...v1.1.2) (2021-12-27)

## [1.1.0](https://github.com/DeAccountSystems/das-sdk/compare/v0.4.1...v1.1.0) (2021-12-24)


### Features

* **Das.ts:** remove `accountsForOwner()`, add `reverseRecord()` ([bb2dffa](https://github.com/DeAccountSystems/das-sdk/commit/bb2dffaa6b2d92edae9e7b98445db620fcbc25e5))
* **DasService.ts:** integrate with new das-account-indexer ([bf9cac4](https://github.com/DeAccountSystems/das-sdk/commit/bf9cac4eecc7535f457b6a156a78d285ce5284d8))

### [0.4.1](https://github.com/DeAccountSystems/das-sdk/compare/v0.3.3...v0.4.1) (2021-08-09)


### Features

* add method `accountsForOwner` ([4fbd77f](https://github.com/DeAccountSystems/das-sdk/commit/4fbd77f1f9c0cdc06bd81e9f28aafb0a98c99286))
* remove unnecessary dependencies ([2645d14](https://github.com/DeAccountSystems/das-sdk/commit/2645d14d16ff4d4179d2d6b7bd08a38648c98821))

### [0.3.3](https://github.com/DeAccountSystems/das-sdk/compare/v0.3.1...v0.3.3) (2021-07-29)


### Features

* remove unused code ([82bc2d1](https://github.com/DeAccountSystems/das-sdk/commit/82bc2d15c24860fd184d0c5642f629941d608fc2))
* remove unused code ([339eea5](https://github.com/DeAccountSystems/das-sdk/commit/339eea5008143b7c19593d0ca75c8bfb2b4b678b))


### Bug Fixes

* `custom` => `custom_key` ([68b8b50](https://github.com/DeAccountSystems/das-sdk/commit/68b8b50df0ac419e51897e6ebf3966219870de8b))

### [0.3.1](https://github.com/DeAccountSystems/das-sdk/compare/v0.2.1...v0.3.1) (2021-07-26)


### Features

* add Das() class ([58ae5bd](https://github.com/DeAccountSystems/das-sdk/commit/58ae5bd71b85d9790dbd4ccc76333fd1e68d9506))

### [0.2.1](https://github.com/DeAccountSystems/das-sdk/compare/v0.1.5...v0.2.1) (2021-07-24)


### Features

* add `account()` function ([b13f077](https://github.com/DeAccountSystems/das-sdk/commit/b13f07756ae79d99e49410bcfb0b93daf866fe23))

### [0.1.5](https://github.com/DeAccountSystems/das-sdk/compare/v0.1.3...v0.1.5) (2021-07-20)


### Bug Fixes

* fix `addr()` bug ([7f52461](https://github.com/DeAccountSystems/das-sdk/commit/7f5246169a78023d04e74c76210d930ddfc6976b))

### [0.1.3](https://github.com/DeAccountSystems/das-sdk/compare/v0.0.3...v0.1.3) (2021-07-20)


### Features

* add `recordsByKey()` method ([ffe5230](https://github.com/DeAccountSystems/das-sdk/commit/ffe523087bcd519741cf553447ca142627f1e6dc))
* add configuration docs ([ac5224b](https://github.com/DeAccountSystems/das-sdk/commit/ac5224b02476a200f876f975426751488403f5d0))
* add test for `recordsByKey` ([bad1b93](https://github.com/DeAccountSystems/das-sdk/commit/bad1b9315bc2bbf539358db4718b7896407a8a06))
* add test for autonetwork ([16fbd90](https://github.com/DeAccountSystems/das-sdk/commit/16fbd90f18fdd986f4e439f045920028008cee70))
* implement autonetwork ([6925df6](https://github.com/DeAccountSystems/das-sdk/commit/6925df6a773743f21e9bdfb7ff2b73f09d23a356))


### Bug Fixes

* fix test ([20bc061](https://github.com/DeAccountSystems/das-sdk/commit/20bc0613fa14d321bba4c3361ba09766e2135935))

### [0.1.1](https://github.com/DeAccountSystems/das-sdk/compare/v0.0.3...v0.1.1) (2021-07-19)


### Features

* add `recordsByKey()` method ([ffe5230](https://github.com/DeAccountSystems/das-sdk/commit/ffe523087bcd519741cf553447ca142627f1e6dc))
* add test for `recordsByKey` ([bad1b93](https://github.com/DeAccountSystems/das-sdk/commit/bad1b9315bc2bbf539358db4718b7896407a8a06))
* add test for autonetwork ([16fbd90](https://github.com/DeAccountSystems/das-sdk/commit/16fbd90f18fdd986f4e439f045920028008cee70))
* implement autonetwork ([6925df6](https://github.com/DeAccountSystems/das-sdk/commit/6925df6a773743f21e9bdfb7ff2b73f09d23a356))


### Bug Fixes

* fix test ([20bc061](https://github.com/DeAccountSystems/das-sdk/commit/20bc0613fa14d321bba4c3361ba09766e2135935))

### 0.0.3 (2021-07-14)


### Features

* add Das ([b0e3ba8](https://github.com/DeAccountSystems/das-sdk/commit/b0e3ba80f0d992dabc7312fe9fe8e6b8632a35a2))
* change build files ([3f5e810](https://github.com/DeAccountSystems/das-sdk/commit/3f5e810fb726ab1e38963417e187872d4de1b414))
* change repo ([5e38ddf](https://github.com/DeAccountSystems/das-sdk/commit/5e38ddf636053f8cc7327a2104bf6ffa000c9c34))
* remove unused files ([3b64a19](https://github.com/DeAccountSystems/das-sdk/commit/3b64a1931bd26543624f56c86405cfcf5c5f06ee))


### Bug Fixes

* fix record bug ([18a0a82](https://github.com/DeAccountSystems/das-sdk/commit/18a0a8235c2d72cf5a2a5d57f5c53ca068cd8411))
