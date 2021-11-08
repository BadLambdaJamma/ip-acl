export default class iputils {
    
    public static clientip(req:any) : string {
        // sample ipv4 data ' ::ffff:127.0.0.1'
        const ip = new String(req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        return ip.substr(ip.lastIndexOf(":")+1);
    }
}