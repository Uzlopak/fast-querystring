import benchmark from "cronometro";
import qs from "qs";
import fastQueryString from "../lib/index.js";
import native from "node:querystring";
import queryString from "query-string";
import querystringify from "querystringify";
import awsQueryStringParser from "@aws-sdk/querystring-parser";

const input = "frappucino=muffin&goat=scone&pond=moose&foo=bar&foo=baz";

await benchmark(
  {
    qs() {
      return qs.parse(input);
    },
    "fast-querystring"() {
      return fastQueryString.parse(input);
    },
    "node:querystring"() {
      return native.parse(input);
    },
    "query-string"() {
      return queryString.parse(input);
    },
    "URLSearchParams-with-Object.fromEntries"() {
      const urlParams = new URLSearchParams(input);
      return Object.fromEntries(urlParams);
    },
    "URLSearchParams-with-construct"() {
      const u = new URLSearchParams(input);
      const data = {};
      for (const [key, value] of u.entries()) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else if (data[key]) {
          data[key] = [].concat(data[key], value);
        } else {
          data[key] = value;
        }
      }
      return data;
    },
    querystringify() {
      return querystringify.parse(input);
    },
    "@aws-sdk/querystring-parser"() {
      return awsQueryStringParser.parseQueryString(input);
    },
  },
  { warmup: true },
);