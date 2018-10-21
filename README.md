# page-loader
This is the page-loader Node.js project.

[![Maintainability](https://api.codeclimate.com/v1/badges/0cd9e06df7f14f65d9cc/maintainability)](https://codeclimate.com/github/subakaev/project-lvl3-s334/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0cd9e06df7f14f65d9cc/test_coverage)](https://codeclimate.com/github/subakaev/project-lvl3-s334/test_coverage)
[![Build Status](https://travis-ci.org/subakaev/project-lvl3-s334.svg?branch=master)](https://travis-ci.org/subakaev/project-lvl3-s334)

# Installation

```
~$ cd ~/Desktop
~$ git clone https://github.com/subakaev/project-lvl3-s334.git
~$ cd ~/Desktop/project-lvl3-s334
~$ make build
~$ sudo npm link
```

Run
```
~$ page-loader --output <path-to-save> <download-url>
```

# Demo with listr spinners

[![asciicast](https://asciinema.org/a/N8k21iQSzZCSho6KuGergm1AK.png)](https://asciinema.org/a/N8k21iQSzZCSho6KuGergm1AK)

# Debugging

Run in Debug mode

```
~$ DEBUG="page-loader:*" page-loader --output <path-to-save> <download-url>
```

[![asciicast](https://asciinema.org/a/f6DTsndrpXEq6HnnBLZ67laHO.png)](https://asciinema.org/a/f6DTsndrpXEq6HnnBLZ67laHO)

# Error Handling Demo

[![asciicast](https://asciinema.org/a/UdYh1Dmo7BJMyRxcB0aVE2vac.png)](https://asciinema.org/a/UdYh1Dmo7BJMyRxcB0aVE2vac)
