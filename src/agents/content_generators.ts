const parseArray = (out: string) => {
    console.log(`[ParseArray] Parsing array from ${JSON.stringify(out)}...`)
    return out.split("\n").map((line) => line.trim());
};