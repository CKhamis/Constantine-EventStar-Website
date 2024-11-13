"use client";
import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Breadcrumb
} from "@/components/ui/breadcrumb";
import React from "react";

export default function BreadcrumbNavigation() {
    const path = window.location.pathname.substring(1).split("/");

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block" key="ESMT">
                    <BreadcrumbLink href="/ESMT">
                        ESMT
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {path.length > 2 && path.map((link, index) => (
                    index < path.length - 1 && index > 0 && (
                        <React.Fragment key={`${link}-${index}`}>
                            <BreadcrumbSeparator className="hidden md:block" key={`${link}-separator-${index}`} />
                            <BreadcrumbItem className="hidden md:block" key={`${link}-item-${index}`}>
                                {link.toUpperCase()}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                ))}

                {path.length > 1 && (
                    <React.Fragment key="last-segment">
                        <BreadcrumbSeparator className="hidden md:block" key="last-separator" />
                        <BreadcrumbItem key={path[path.length - 1]}>
                            <BreadcrumbPage>{path[path.length - 1].toUpperCase()}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </React.Fragment>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
