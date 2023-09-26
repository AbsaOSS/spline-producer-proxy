# Spline Producer Proxy

See: https://github.com/AbsaOSS/spline

This proxy server acts as a buffer between the _Spline Agents_ and the _Spline Server_. The main use-case is to decouple agents from the server temporarily for the time when the server is unavailable (e.g. for maintainence).
The proxy server exposes the same Spline Producer REST API as the _Spline Server_. All the received data is stored on the filesystem in a text format, to be later sent to the original _Spline Server_ when it is available.

## Building

```shell
npm ci
npm build:prod
docker build . -t <IMAGE/NAME>
```

## Usage

```shell 
docker run -e OUT_FILE=<path_to_dump_file> -p 8080:3000 AbsaOSS/spline-producer-proxy

# to re-send collected requests to the intended target server
./send-spline-messages.sh $path_to_dump_file $spline_producer_url
```


---

    Copyright 2023 ABSA Group Limited

    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
