export interface Seo {
    title: string;
    description?: string;
    canonical?: string;
    robots?: string;
    type?: string;
    image?: string | null;
    site?: string;
    json_ld?: string | null;
}

export interface PlatformInfo {
    value: string;
    label: string;
    color: string;
    logo: string | null;
}

export interface JobCardData {
    id: number;
    slug: string;
    url: string;
    title: string;
    company: { name: string; logo_url: string | null };
    location: string | null;
    work_mode: { value: 'remote' | 'hybrid' | 'onsite'; label: string };
    employment_type: string;
    experience_level: string | null;
    salary: string | null;
    platform: PlatformInfo;
    category: { name: string; slug: string } | null;
    published_at: string | null;
    published_label: string | null;
    is_new: boolean;
    is_featured: boolean;
}

export interface JobDetailData extends JobCardData {
    status: string;
    sections: Record<'description' | 'responsibilities' | 'requirements' | 'nice_to_have' | 'benefits' | 'additional_info', string | null>;
    apply_url: string | null;
    apply_email: string | null;
    apply_host: string | null;
    source_name: string | null;
    expires_at: string | null;
    expires_label: string | null;
    published_date_label: string | null;
    company_about: string | null;
    company_website: string | null;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_url?: string | null;
    next_url?: string | null;
    links: { page: number; url: string; active: boolean }[];
}

export interface Option {
    value: string;
    label: string;
}

export interface FilterOptions {
    work_modes: Option[];
    employment_types: Option[];
    experience_levels: Option[];
    categories: Option[];
    platforms: (PlatformInfo & { count: number })[];
}

export interface Breadcrumb {
    label: string;
    url: string | null;
}

export interface CategorySummary {
    name: string;
    slug: string;
    icon: string | null;
    count: number;
    url: string;
}
