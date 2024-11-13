"use client"
import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Breadcrumb
} from "@/components/ui/breadcrumb";

export default function BreadcrumbNavigation(){

    const path = window.location.pathname.substring(1).split("/");
    console.log(path);

    return (
        <Breadcrumb>
            <BreadcrumbList>

                <BreadcrumbItem className="hidden md:block" key="ESMT">
                    <BreadcrumbLink href="/ESMT">
                        ESMT
                    </BreadcrumbLink>
                </BreadcrumbItem>


                {path.length > 2 && path.map((link, index) => (
                    index < path.length-1 && index > 0 &&
                    <>
                        <BreadcrumbSeparator className="hidden md:block" key={`${link}-separator`} />
                        <BreadcrumbItem className="hidden md:block" key={link}>
                            {link.toUpperCase()}
                        </BreadcrumbItem>
                    </>
                ))}

                {path.length > 1 && (
                    <>
                        <BreadcrumbSeparator className="hidden md:block" key="last-breadcrumb" />
                        <BreadcrumbItem key={path[path.length-1]}>
                            <BreadcrumbPage>{path[path.length-1].toUpperCase()}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}

            </BreadcrumbList>
        </Breadcrumb>
    );
}