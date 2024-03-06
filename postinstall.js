import { writeFileSync } from "fs";

function main() {
    writeFileSync("./privates.txt", "key1\nkey2\n...");
    writeFileSync("./proxies.txt", "login:pass@ip:port");
}
main();
