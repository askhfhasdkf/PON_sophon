import { importETHWallets, importProxies, writeToFile } from "./accs.js";
import { Wallet, ethers } from "ethers";
import { signUp } from "./register.js";
import { RandomHelpers, logResult, sleep, c } from "./helpers.js";

async function main() {
    let keys = await importETHWallets();
    let proxies = await importProxies();
    await writeToFile("./results.csv", "id,address,key,result");
    for (let i = 0; i < keys.length; i++) {
        let signer = new Wallet(keys[i]);
        console.log(c.bgMagenta(`starting ${i+1}`), signer.address);
        let proxy;
        if (proxies.length > 0) {
            proxy = RandomHelpers.chooseElementFromArray(proxies);
        } else {
            proxy = "";
        }
        let res = await signUp(signer, proxy);
        await logResult(i, signer.address, keys[i], res);
        await sleep(RandomHelpers.getRandomIntFromTo(5, 15));
    }
}
main();
