import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { sleep, defaultSleep, RandomHelpers } from "./helpers.js";
import { Wallet } from "ethers";

class Sophon {
    urls = {
        register: "https://sophon.xyz/api/users/register",
        users: "https://sophon.xyz/api/users",
        tweet: "https://sophon.xyz/api/tweet",
        ping: "https://sophon.xyz/api/users/ping",
    };
    signatureMessage = `Sophon is leading us all towards a brighter future.`;
    headers = {
        Origin: "https://sophon.xyz",
        Referer: "https://sophon.xyz/",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    };
    signer;
    proxy;
    /**
     *
     * @param {Wallet} signer
     * @param {string} proxy
     */
    constructor(signer, proxy) {
        this.signer = signer;
        this.proxy = proxy;

        if (proxy) {
            this.session = axios.create({
                httpAgent: new HttpsProxyAgent("http://" + proxy),
                httpsAgent: new HttpsProxyAgent("http://" + proxy),
            });
        } else {
            this.session = axios.create({ headers: this.headers });
        }
        this.seed = Math.random().toString(36).substring(2);
    }
    /**
     *
     * @param {Wallet} signer
     */
    async register() {
        try {
            await this.ping();
            let signature = await this.signer.signMessage(this.signatureMessage);
            let resp = await this.session.post(
                this.urls.register,
                {
                    address: this.signer.address,
                    signature: signature,
                },
                {},
            );
            this.registered = true;
            await this.ping();
        } catch (e) {
            console.log(e);
            this.registered = false;
        }
    }
    async tweet() {
        await this.ping();
        try {
            let resp = await this.session.post(
                this.urls.tweet,
                {
                    address: this.signer.address,
                },
                {},
            );
            this.randomString = resp.data.randomString;
            this.tweeted = true;
            await this.ping();
            return true;
        } catch (e) {
            console.log(e);
            this.tweeted = false;
            return false;
        }
    }
    async getState() {
        await this.ping();
        try {
            let resp = await this.session.get(this.urls.users + `/${this.signer.address}`, {});
            this.tweeted = resp.data.hasTweeted;
            this.registered = true;
            console.log(`wallet already registered`);
            await this.ping();
            return true;
        } catch (e) {
            if (e?.response?.status == 404) {
                console.log(`wallet not registered`);
                this.registered = false;
            }
            // throw e;
            return false;
        }
    }
    async ping() {
        try {
            await this.session.post(this.urls.ping, { seed: this.seed }, {});
        } catch (e) {}
    }
}
/**
 *
 * @param {Wallet} signer
 */
async function signUp(signer, proxy) {
    let sophon = new Sophon(signer, proxy);
    await sophon.ping();
    let alreadyRegistered = await sophon.getState();
    await defaultSleep(RandomHelpers.getRandomIntFromTo(1, 3));
    if (!alreadyRegistered) {
        await sophon.register();
        await defaultSleep(RandomHelpers.getRandomIntFromTo(3, 10));
        await sophon.tweet();
    }
    if (!sophon.registered) {
        return false;
    }
    if (sophon.registered && !sophon.tweeted) {
        return sophon.tweet();
    }
    return true;
}

export { signUp };
