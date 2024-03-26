import {
	Link,
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem, Button, Image
} from "@nextui-org/react";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import {
	GithubIcon, HeartFilledIcon,
} from "@/components/icons";

import React from "react";
import {siteConfig} from "@/config/site";
import clsx from "clsx";
import { link as linkStyles } from "@nextui-org/theme";

export const Navbar = () => {
	return (
		<NextUINavbar maxWidth="xl" position="sticky" className="shadow">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Image width={24} alt="Logo"  src="/ollama.png" />
						<p className="font-bold text-inherit" style={{fontSize: "20px"}}>Ollama UI</p>
					</NextLink>
				</NavbarBrand>
				<div className="hidden lg:flex gap-4 justify-start ml-2">
					<NavbarItem key="home">
						<NextLink
							className={clsx(
								linkStyles({ color: "foreground" }),
								"data-[active=true]:text-primary data-[active=true]:font-medium"
							)}
							color="foreground" target="_blank"
							href="https://github.com/obiscr/ollama-ui/README.md"
						>
							Getting Started
						</NextLink>
					</NavbarItem>
				</div>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex basis-2/5 sm:basis-full" justify="end">
				<NavbarItem className="hidden items-center sm:flex gap-2">
					<Link isExternal href={siteConfig.links.github}>
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem>
					<Button
						isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					>
						Sponsor
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<ThemeSwitch />
				<NavbarMenuToggle/>
			</NavbarContent>

			<NavbarMenu>
				<NavbarMenuItem>
					<Link color="foreground" isExternal href={siteConfig.links.github}><GithubIcon className="text-default-500" /> GitHub</Link>
				</NavbarMenuItem>
			</NavbarMenu>
		</NextUINavbar>
	);
};
