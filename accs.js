import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as stream from "stream";
import { once } from "events";

const __dirname = path.resolve();

export const importETHWallets = async (pathToFile = "./privates.txt") => {
    let accs = [];
    let instream = fs.createReadStream(path.join(__dirname, pathToFile));
    let outstream = new stream.Stream();
    let rl = readline.createInterface(instream, outstream);
    rl.on("line", (line) => {
        accs.push(line);
    });
    await once(rl, "close");
    return accs;
};
export const importProxies = async () => {
    let initialData = await importETHWallets("./proxies.txt");
    let proxies = [];
    for (let [index, data] of initialData.entries()) {
        proxies.push(data);
    }
    return proxies;
};
export const appendResultsToFile = async (file, data) => {
    fs.appendFile(`./${file}`, data + "\n", (err) => {
        if (err) throw err;
    });
};
export const writeToFile = async (file, data) => {
    fs.writeFile(`./${file}`, data + "\n", (err) => {
        if (err) throw err;
    });
};
