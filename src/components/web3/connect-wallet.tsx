// src/app.tsx
import { client } from "@/client";
import { Wallet2Icon } from "lucide-react";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { Button } from "../ui/button";

export default function ConnectWallet() {
    const wallets = [createWallet("app.phantom")];

    return (
        <ConnectButton 
            client={client} 
            wallets={wallets}
            detailsButton={{
                // className: "!h-11 !p-2 !shrink-0 !text-xs !text-[#FFFFFF] !shadow !bg-[#44403C]/90 hover:!bg-[#44403C] !inline-flex !items-center !justify-center !rounded-full !text-sm !transition-colors focus-visible:!outline-none focus-visible:!ring-1 focus-visible:!ring-ring disabled:!pointer-events-none disabled:!opacity-50",
                style: {
                    minWidth: "none",
                    height: 'none', 
                    fontSize: 'none',
                },
                connectedAccountAvatarUrl: "https://avatars.githubusercontent.com/u/92748035?v=4",
            }}
            connectModal={{ 
                size: "compact",
                titleIcon: "https://avatars.githubusercontent.com/u/92748035?v=4",
            }}
            detailsModal={{
                assetTabs: ["nft", "token"],
            }}
            connectButton={{
                className: "!h-9 !p-3 !shrink-0 !text-xs !text-[#FFFFFF] !shadow !bg-[#131418]/90 hover:!bg-[#131418] !inline-flex !items-center !justify-center !rounded-md !text-sm !transition-colors focus-visible:!outline-none focus-visible:!ring-1 focus-visible:!ring-ring disabled:!pointer-events-none disabled:!opacity-50",
                style: {
                    minWidth: "none",
                    height: 'none', 
                    fontSize: 'none',
                },
                label: "Connect Wallet",
            }}
            theme={"dark"}
        />
    );
}
