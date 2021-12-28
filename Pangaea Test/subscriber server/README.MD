OVERVIEW

The functional requirements for every system that implements a Publisher-Subscriber relationship boils down to 
an event-based (message-receipt) dispatch action within a bidrectional; long-polled (or equivalent) publisher and subscriber
connection.

There are several implementations that can be used for this service. The choice is determined by technical 
factors including percentage of external package dependency permitted, security concerns, available expertise, etc. 


FUNCTIONAL REQUIREMENTS
1. ACTIVITIES AND PAYLOAD SHOULD BE TRANSFERRED BY HTTP REQUESTS





NON-FUNCTIONAL REQUIREMENTS
1. 
2. 
3. 
4. 


Certain considerations have been taken into account in the design of this system.

DESIGN CONSIDERATIONS
AS MUCH AS POSSIBLE, THE PROJECT FOLLOWS  THESE RULES:
1. MODULAR PATTERN
2. NO GLOBAL VARIABLES (to avoid interference of bindings)
3. DRY PATTERN
4. IMMUTABLE OBJECTS
SINCE THIS IS A NATIVE HTTP-BASED SYSTEM, WE ASSUME A DESIGN THAT IS MINIMALIST IN TERMS OF EXTERNAL PACKAGES.
AN ALTERNATIVE IS USING A SERVICE LIKE REDIS WHICH COMES WITH MOST HELPER-SERVICES NEEDED FOR A PUB-SUB, OUT OF
THE BOX.

STORAGE - FOR DATA-PERSISTENCE, IN PRODUCTION, A COMBINATION OF AN IN-MEMORY AND ON-DISK STORAGE IS NECESSARY TO AID 
FAST RETRIEVAL OF DATA (USING A WRITE-THROUGH CACHE POLICY, INSTEAD OF WRITE-BACK FOR IN-MEMORY).
THIS ALSO DEPENDS ON SCALE OF THE SYSTEM INVOLVED.
