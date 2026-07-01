import { fbq } from "./pixel";
import { getBrowserCookies, getFbcFromUrl } from "./cookies";
import { Customer, Booking, Package } from "./types";

/**
 * Generates a unique event ID to deduplicate browser and CAPI events.
 */
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

interface EventOptions {
  customData?: Record<string, any>;
  userData?: Customer;
  isCustom?: boolean;
}

/**
 * Central event tracking orchestrator.
 * Triggers client-side Pixel first, and then triggers server-side CAPI asynchronously.
 * 
 * @param eventName Name of standard or custom Meta event.
 * @param options Event options containing custom data and user identifiers.
 */
export async function trackFacebookEvent(
  eventName: string,
  options: EventOptions = {}
) {
  if (typeof window === "undefined") return;

  const eventId = generateEventId();
  const { customData = {}, userData, isCustom = false } = options;

  // Retrieve matching cookies
  const cookies = getBrowserCookies();
  const fbp = cookies.fbp;
  const fbc = cookies.fbc || getFbcFromUrl(window.location.href);

  // 1. Dispatch Client-Side Browser Pixel Event
  const pixelPayload = { ...customData };
  
  if (isCustom) {
    fbq("trackCustom", eventName, pixelPayload, { eventID: eventId });
  } else {
    fbq("track", eventName, pixelPayload, { eventID: eventId });
  }

  // 2. Dispatch Server-Side CAPI Event via Next.js Route Handler
  try {
    const capiPayload = {
      eventName,
      eventId,
      eventTime: Math.floor(Date.now() / 1000),
      eventSourceUrl: window.location.href,
      referrer: document.referrer,
      userData: {
        email: userData?.email || undefined,
        phone: userData?.phone || undefined,
        name: userData?.name || undefined,
        fbp,
        fbc,
      },
      customData,
    };

    fetch("/api/analytics/facebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(capiPayload),
    }).catch((err) => {
      console.warn("Facebook CAPI background post failed", err);
    });
  } catch (error) {
    console.error("Error dispatching Facebook CAPI event", error);
  }
}

/* ==========================================
   Standard Events Helpers
   ========================================== */

export function trackPageView(user?: Customer) {
  trackFacebookEvent("PageView", { userData: user });
}

export function trackViewContent(
  contentName: string,
  category: string,
  id: string,
  price: number,
  user?: Customer
) {
  trackFacebookEvent("ViewContent", {
    customData: {
      content_name: contentName,
      content_category: category,
      content_ids: [id],
      content_type: "product",
      value: price,
      currency: "BDT",
    },
    userData: user,
  });
}

export function trackSearch(searchQuery: string, user?: Customer) {
  trackFacebookEvent("Search", {
    customData: {
      search_string: searchQuery,
    },
    userData: user,
  });
}

export function trackLead(leadType: string, value?: number, user?: Customer) {
  trackFacebookEvent("Lead", {
    customData: {
      content_category: leadType,
      value: value,
      currency: "BDT",
    },
    userData: user,
  });
}

export function trackContact(method: string, user?: Customer) {
  trackFacebookEvent("Contact", {
    customData: {
      contact_method: method,
    },
    userData: user,
  });
}

export function trackCompleteRegistration(method: string, user?: Customer) {
  trackFacebookEvent("CompleteRegistration", {
    customData: {
      registration_method: method,
    },
    userData: user,
  });
}

export function trackInitiateCheckout(
  pkg: Package,
  guests: number,
  user?: Customer
) {
  trackFacebookEvent("InitiateCheckout", {
    customData: {
      content_name: pkg.title,
      content_category: pkg.category || "Sundarban Tour",
      content_ids: [pkg._id],
      content_type: "product",
      value: pkg.price * guests,
      currency: "BDT",
      num_items: guests,
      contents: [{ id: pkg._id, quantity: guests, item_price: pkg.price }],
    },
    userData: user,
  });
}

export function trackAddPaymentInfo(
  paymentMethod: string,
  value: number,
  user?: Customer
) {
  trackFacebookEvent("AddPaymentInfo", {
    customData: {
      payment_method: paymentMethod,
      value: value,
      currency: "BDT",
    },
    userData: user,
  });
}

export function trackPurchase(
  booking: Booking,
  pkg: Package,
  user?: Customer
) {
  trackFacebookEvent("Purchase", {
    customData: {
      content_name: pkg.title,
      content_category: pkg.category || "Sundarban Tour",
      content_ids: [pkg._id],
      content_type: "product",
      value: booking.totalPrice,
      currency: "BDT",
      num_items: booking.guests,
      contents: [{ id: pkg._id, quantity: booking.guests, item_price: pkg.price }],
      // Custom parameters required by the user:
      bookingId: booking._id,
      packageId: pkg._id,
      packageSlug: pkg.slug,
      packageName: pkg.title,
      destination: pkg.location,
      travelDate: booking.startDate instanceof Date ? booking.startDate.toISOString() : booking.startDate,
      travelerCount: booking.guests,
      quantity: booking.guests,
      couponCode: booking.couponCode || "",
      discountAmount: booking.discountAmount || 0,
      paymentMethod: booking.paymentMethod || "unknown",
    },
    userData: user,
  });
}

/* ==========================================
   Custom Events Helpers
   ========================================== */

export function trackCustomEvent(
  eventName: string,
  customData: Record<string, any> = {},
  user?: Customer
) {
  trackFacebookEvent(eventName, {
    customData,
    userData: user,
    isCustom: true,
  });
}

export function trackViewDestination(destination: string, user?: Customer) {
  trackCustomEvent("ViewDestination", { destination }, user);
}

export function trackViewPackage(pkg: Package, user?: Customer) {
  trackCustomEvent("ViewPackage", {
    packageId: pkg._id,
    packageName: pkg.title,
    packageSlug: pkg.slug,
    price: pkg.price,
  }, user);
}

export function trackViewHotel(hotelName: string, destination: string, user?: Customer) {
  trackCustomEvent("ViewHotel", { hotelName, destination }, user);
}

export function trackViewGallery(galleryTitle: string, user?: Customer) {
  trackCustomEvent("ViewGallery", { galleryTitle }, user);
}

export function trackViewItinerary(packageId: string, packageName: string, user?: Customer) {
  trackCustomEvent("ViewItinerary", { packageId, packageName }, user);
}

export function trackBookNowClicked(packageId: string, packageName: string, user?: Customer) {
  trackCustomEvent("BookNowClicked", { packageId, packageName }, user);
}

export function trackCouponApplied(couponCode: string, discountAmount: number, user?: Customer) {
  trackCustomEvent("CouponApplied", { couponCode, discountAmount }, user);
}

export function trackWhatsAppClick(user?: Customer) {
  trackCustomEvent("WhatsAppClick", {}, user);
}

export function trackPhoneCallClick(phoneNumber: string, user?: Customer) {
  trackCustomEvent("PhoneCallClick", { phoneNumber }, user);
}

export function trackMessengerClick(user?: Customer) {
  trackCustomEvent("MessengerClick", {}, user);
}

export function trackReviewSubmitted(packageId: string, rating: number, user?: Customer) {
  trackCustomEvent("ReviewSubmitted", { packageId, rating }, user);
}

export function trackWishlist(pkg: Package, user?: Customer) {
  trackCustomEvent("Wishlist", {
    packageId: pkg._id,
    packageName: pkg.title,
  }, user);
}

export function trackSharePackage(packageId: string, packageName: string, channel: string, user?: Customer) {
  trackCustomEvent("SharePackage", { packageId, packageName, channel }, user);
}

export function trackNewsletterSubscribed(email: string, user?: Customer) {
  trackCustomEvent("NewsletterSubscribed", { email_provided: true }, { ...user, email });
}
