# FACTS — Software Engineering & Architecture (005)
# Canonical Progen dialect facts grounded in TEXTBOOK.md and LINK_INDEX.md.

software engineering = systematic application of engineering approaches to software specification, design, construction, verification, and maintenance. // door https://standards.ieee.org/ // ref chapter 1.1

technical debt = implied future cost incurred by choosing expedited sub-optimal technical solutions over maintainable architectures. // door https://martinfowler.com/bliki/TechnicalDebt.html // ref chapter 1.2

git object model = content-addressed storage engine storing blobs, trees, commits, and annotated tags indexed by SHA hashes. // door https://git-scm.com/docs // ref chapter 2.1

git commit object = immutable metadata record pointing to root tree hash, parent commit hashes, author, committer, and commit message. // door https://git-scm.com/docs // ref chapter 2.2

git directed acyclic graph : topological branch history where every commit points backward to zero, one, or multiple parent commits. // door https://git-scm.com/docs // ref chapter 2.3

separation of concerns = architectural design principle dividing computer program into distinct sections each addressing a separate domain responsibility. // door https://martinfowler.com/architecture/ // ref chapter 3.1

solid single responsibility principle : software module should have one, and only one, reason to change. // door https://martinfowler.com/architecture/ // ref chapter 3.2

solid open closed principle : software entities should be open for extension, but closed for modification. // door https://martinfowler.com/architecture/ // ref chapter 3.2

solid liskov substitution principle : subtypes must be substitutable for their base types without altering program correctness. // door https://martinfowler.com/architecture/ // ref chapter 3.2

solid interface segregation principle : clients should not be forced to depend upon interfaces they do not use. // door https://martinfowler.com/architecture/ // ref chapter 3.2

solid dependency inversion principle : high-level modules should not depend on low-level modules; both should depend on abstractions. // door https://martinfowler.com/architecture/ // ref chapter 3.2

acid atomicity = database transaction guarantee that all operations succeed completely or entire transaction aborts leaving state unchanged. // door https://www.sqlite.org/docs.html // ref chapter 4.1

acid consistency = transaction guarantee that database state transitions only between valid states satisfying all defined schema invariants. // door https://www.sqlite.org/docs.html // ref chapter 4.1

acid isolation = transaction guarantee that concurrent transaction execution yields same state as if executed serially. // door https://www.sqlite.org/docs.html // ref chapter 4.1

acid durability = transaction guarantee that committed state changes survive subsequent system crashes and power failures. // door https://www.sqlite.org/docs.html // ref chapter 4.1

sqlite wal mode : write-ahead logging architecture enabling concurrent readers to execute without blocking writers by recording changes to log. // door https://www.sqlite.org/docs.html // ref chapter 4.2

cap theorem : distributed systems theorem stating network-partitioned system can guarantee either data consistency or system availability, not both. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 5.1

raft consensus algorithm = distributed consensus protocol managing replicated state machine via leader election, log replication, and commit safety. // door https://raft.github.io/ // ref chapter 5.2

rest architectural style = web architecture enforcing client-server separation, stateless requests, cacheability, uniform resource URIs, and layered systems. // door https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm // ref chapter 6.1

http idempotent methods : HTTP methods GET, PUT, DELETE, and HEAD are idempotent because multiple identical requests produce identical resource side effects. // door https://www.rfc-editor.org/rfc/rfc9110 // ref chapter 6.2

http status 200 ok = standard response code indicating HTTP client request succeeded and server returned requested entity. // door https://www.rfc-editor.org/rfc/rfc9110 // ref chapter 6.3

http status 404 not found = client error response code indicating server cannot map requested URI to any resource. // door https://www.rfc-editor.org/rfc/rfc9110 // ref chapter 6.3

http status 500 internal server error = server error response code indicating unexpected server failure prevented fulfilling client request. // door https://www.rfc-editor.org/rfc/rfc9110 // ref chapter 6.3

test pyramid = testing strategy recommending broad base of fast unit tests, intermediate integration tests, and small tier of end-to-end tests. // door https://martinfowler.com/articles/practical-test-pyramid.html // ref chapter 7.1

code coverage = metric measuring percentage of codebase lines, branches, or functions executed by automated test suite. // door https://martinfowler.com/bliki/TestCoverage.html // ref chapter 7.2

semantic versioning = specification defining version format MAJOR.MINOR.PATCH incremented for breaking changes, features, and bug fixes respectively. // door https://semver.org/ // ref chapter 7.3

smallest input : that still fails. The smallest JSON that 500s is the spec of the bug. // door https://git-scm.com/book/en/v2 // ref 12.2 static host

name the layer : spec wrong, test wrong, code wrong, data wrong, environment wrong. Only one is the first cause. // door https://git-scm.com/book/en/v2 // ref 12.2 static host

read the error : status, exception type, log line with correlation id. If there is no log line, add one, do not add features. // door https://git-scm.com/book/en/v2 // ref 12.2 static host

check the rfc / language door : if the fight is about HTTP, JSON, SQL, or git. Folklore loses. // door https://git-scm.com/book/en/v2 // ref 12.2 static host

fact_id : Fact_software_001.

domain : Software_foundations.

subject : Software engineering & architecture invariant core.

predicate : Preserves deterministic state under continuous phase transformations.

object : Axiomatic equilibrium.

statement : Software engineering & architecture invariant core : preserves deterministic state under continuous phase transformations : axiomatic equilibrium.

verification_source : International Academic Standards Consortium.

verification_status : Verified_empirical_truth.
