# webflight-copterface

This plugin adds face recognition and tracking to the [ardrone-webflight](https://github.com/eschnou/ardrone-webflight) environment. The drone will attempt to detect a face and will try to keep always facing at the face by autonomously rotating towards.

This plugin is a port of [copterface](https://github.com/paulhayes/copterface) to the [ardrone-webflight](https://github.com/eschnou/ardrone-webflight) environment.

![Copterface screenshot](screenshot.jpg "Screenshot")

## Warning

This code will trigger autonomous movements of the drone. Use at your own risk and test it in a controlled environment before going outdoors. 

## Install

- Either copy, link, or use git-submodule to put this code repository in the webflight plugin folder. 

- Edit your webflight config.js to enable this plugin

- Launch webflight

- Press the 'f' key to toggle face tracking on/off

## Thanks

Thanks a lot to [Paul Hayes](https://github.com/paulhayes) for coming up with this awesome hack and sharing it with the rest of the world.

## License

Copyright (c) 2012-2013 Laurent Eschenauer, Paul Hayes, Philippe Modard

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

